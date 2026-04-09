<script setup lang="tsx">
import { computed, ref } from 'vue'
import { currencyInfo } from '@/lib/currencyInfo'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import {
  type CollectionPreview,
  type OptionCreateForm,
  type ProductCreateDTO,
  type ProductVariantCreateForm,
} from '@/lib/types'
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronUpDownIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'
import { fetchCollections } from '@/api/queries'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import TitleAndDescription from '@/components/TitleAndDescription.vue'
import StatusLabel from '@/components/StatusLabel.vue'
import CreateProductOptionsPanel from '@/components/CreateProductOptionsPanel.vue'
import TanstackTable from '@/components/TanstackTable.vue'
import InventoryPanel from '@/components/InventoryPanel.vue'
import {
  generateCloudinarySignature,
  postNewProduct,
  uploadImageToCloudinary,
} from '@/api/mutations'
import router from '@/router'
import { createColumnHelper, useVueTable, getCoreRowModel } from '@tanstack/vue-table'
import PriceInput from '@/components/PriceInput.vue'
import PriceCell from '@/components/cells/PriceCell.vue'
import { ElNotification, ElTag, ElMessageBox } from 'element-plus'
import { useAuth0 } from '@auth0/auth0-vue'
import EditNewProductVariant from '@/components/dialogs/EditNewProductVariant.vue'
import ImageInput from '@/components/ImageInput.vue'

const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } = useAuth0()

const title = ref('')
const description = ref('')
const selectedCollections = ref<CollectionPreview[]>([])
const productStatus = ref(false)
const defaultVariant = ref({
  price: null,
  sku: null,
  quantity: null,
})
const file = ref<File | undefined>()
const imageAlt = ref(null)
const options = ref<OptionCreateForm[]>([])
const variants = ref<ProductVariantCreateForm[]>([])
const isEditVariantOpen = ref(false)
const activeEditVariantId = ref()
const isLoading = ref(false)

const collections = computed(() => collectionsQuery.data.value?.collections ?? [])
const validOptions = computed(() =>
  options.value.filter((option) => option.values.some((value) => value.name.length)),
)
const activeEditVariant = computed(() =>
  variants.value.find((v) => v.id === activeEditVariantId.value),
)

const columnHelper = createColumnHelper<ProductVariantCreateForm>()

const queryClient = useQueryClient()

const collectionsQuery = useQuery({
  queryKey: ['collections'],
  queryFn: fetchCollections,
})

const newProductMutation = useMutation({
  mutationFn: ({ token, newProduct }: { token: string; newProduct: ProductCreateDTO }) =>
    postNewProduct(token, newProduct),
  onSuccess: (data) => {
    const { product } = data
    router.push({ name: 'productDetails', params: { id: product.id } })
  },
})

const columns = [
  columnHelper.accessor('title', {
    header: 'Title',
  }),
  columnHelper.accessor('sku', {
    header: 'SKU',
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    sortingFn: 'alphanumeric',
    cell: (props) => (
      <PriceCell
        price={props.cell.getValue()}
        locale={currencyInfo.locale}
        currencySymbol={currencyInfo.symbol}
      />
    ),
  }),
  columnHelper.accessor('inventoryQuantity', {
    header: 'Inventory',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.display({
    id: 'actions',
    cell: (props) => (
      <button
        type="button"
        aria-label="Edit variant"
        class="p-1 rounded-md hover:bg-cool-gray"
        onClick={() => {
          activeEditVariantId.value = props.row.id
          isEditVariantOpen.value = true
        }}
      >
        <PencilSquareIcon class="size-4" aria-hidden="true" />
      </button>
    ),
  }),
]

const variantsTable = useVueTable({
  columns,
  data: variants,
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
})

const saveVariantEdit = (updatedVariantInfo: Omit<ProductVariantCreateForm, 'selectedValues'>) => {
  const existingVariantIdx = variants.value.findIndex(
    (variant) => variant.id === updatedVariantInfo.id,
  )
  const existingVariant = variants.value[existingVariantIdx]
  if (!existingVariant) throw new Error(`Variant ID does not exist: ${updatedVariantInfo.id}`)

  const updatedVariant = { ...existingVariant, ...updatedVariantInfo }

  const newVariantsArr = [...variants.value]
  newVariantsArr.splice(existingVariantIdx, 1, updatedVariant)

  variants.value = newVariantsArr
  activeEditVariantId.value = undefined
  isEditVariantOpen.value = false
}

const cancelVariantEdit = () => {
  activeEditVariantId.value = undefined
  isEditVariantOpen.value = false
}

const revalidateProducts = async () => {
  try {
    await queryClient.invalidateQueries({ queryKey: ['products'] }, { throwOnError: true })
  } catch (e) {
    ElNotification({
      title: 'Refresh page',
      message: `Error refetching products: ${e}`,
      type: 'error',
      position: 'bottom-right',
    })
  }
}

const handleSubmit = async () => {
  if (isAuthenticated.value) {
    try {
      let featuredImageUrl = null
      isLoading.value = true

      const token = await getAccessTokenSilently()

      if (file.value) {
        featuredImageUrl = await uploadImage(token, file.value)
      }

      if (options.value.length < 1) {
        if (!defaultVariant.value.price || !defaultVariant.value.quantity) {
          throw new Error(`Missing input for price and/or quantity.`)
        }
        await newProductMutation.mutateAsync({
          token,
          newProduct: {
            status: productStatus.value,
            title: title.value,
            description: description.value,
            featuredImage: {
              url: featuredImageUrl,
              altText: imageAlt.value,
            },
            collectionIds: selectedCollections.value.map((collection) => collection.id),
            options: [
              {
                name: 'Default option',
                values: [
                  {
                    name: 'Default option value',
                  },
                ],
              },
            ],
            variants: [
              {
                title: 'Default variant',
                sku: defaultVariant.value.sku,
                price: defaultVariant.value.price,
                inventoryQuantity: defaultVariant.value.quantity,
                selectedValues: [
                  {
                    name: 'Default option value',
                    optionName: 'Default option',
                  },
                ],
              },
            ],
          },
        })
      } else {
        await newProductMutation.mutateAsync({
          token,
          newProduct: {
            status: productStatus.value,
            title: title.value,
            description: description.value,
            featuredImage: {
              url: featuredImageUrl,
              altText: imageAlt.value,
            },
            collectionIds: selectedCollections.value.map((collection) => collection.id),
            options: options.value.map((option) => ({
              name: option.name,
              values: option.values.map((value) => ({
                name: value.name,
              })),
            })),
            variants: variants.value.map((variant) => {
              return {
                title: variant.title,
                sku: variant.sku,
                price: variant.price,
                inventoryQuantity: variant.inventoryQuantity,
                selectedValues: variant.selectedValues.map((value) => {
                  const parentOption = options.value.find((option) => option.id === value.optionId)
                  if (!parentOption) throw new Error('Option value requires parent option name')
                  return {
                    name: value.name,
                    optionName: parentOption.name,
                  }
                }),
              }
            }),
          },
        })
      }

      await revalidateProducts()

      ElNotification({
        title: 'Success',
        message: `Successfully created product: ${title.value}`,
        type: 'success',
        position: 'bottom-right',
      })

      isLoading.value = false
    } catch (e) {
      console.log(e)
      ElNotification({
        title: `Error creating product: ${title.value}`,
        message: `${e}`,
        type: 'error',
        position: 'bottom-right',
      })
      isLoading.value = false
    }
  } else {
    ElMessageBox({
      title: 'Login Required',
      message: 'Authentication is required for this action. Please login to continue.',
      showCancelButton: true,
      confirmButtonText: 'Log In',
    })
      .then((action) => {
        if (action === 'confirm') {
          loginWithRedirect()
        }
      })
      .catch((reason) => console.log(reason))
  }
}

const uploadImage = async (token: string, file: File) => {
  try {
    const signatureResult = await generateCloudinarySignature(token, {
      file_size: file.size,
      content_type: file.type,
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', signatureResult.apiKey)
    formData.append('timestamp', `${signatureResult.timestamp}`)
    formData.append('signature', signatureResult.signature)
    formData.append('folder', signatureResult.folder)

    const uploadResult = await uploadImageToCloudinary(formData)

    return uploadResult.secure_url
  } catch (e) {
    console.log('File upload failed', e)
    ElNotification({
      title: `Error uploading image: ${title.value}`,
      message: `${e}`,
      type: 'error',
      position: 'bottom-right',
    })
    return null
  }
}
</script>

<template>
  <!-- Heading -->
  <div
    v-loading="isLoading"
    class="max-w-5xl mx-auto mb-5 grid grid-cols-1 md:grid-cols-3 gap-5 grid-container"
  >
    <div class="flex items-center w-full gap-3 md:col-span-2">
      <RouterLink
        :to="{ name: 'products' }"
        class="p-1 hover:bg-current/20 rounded border border-gray-400"
      >
        <ArrowLeftIcon class="size-5" />
      </RouterLink>
      <h1 class="font-bold text-xl truncate">{{ title || 'New product' }}</h1>
      <StatusLabel :status="productStatus" />
    </div>

    <!-- Save changes or discard buttons -->
    <div class="max-md:justify-self-center max-md:row-start-4 md:col-start-3">
      <RouterLink :to="{ name: 'products' }">
        <button class="font-semibold rounded-md bg-cool-gray py-1 px-2 hover:opacity-80">
          Discard
        </button>
      </RouterLink>
      <button
        type="submit"
        form="newProductForm"
        class="font-bold rounded-md py-1 px-2 ml-2 bg-fill text-background hover:opacity-80"
      >
        Save
      </button>
    </div>

    <div class="flex flex-col gap-3 md:col-start-3">
      <!-- Product status -->
      <section class="bg-light rounded-xl shadow-lg p-3">
        <Listbox v-model="productStatus" name="product-status">
          <ListboxLabel class="font-semibold">Product status</ListboxLabel>
          <ListboxButton
            class="relative border border-gray-300 rounded p-1 w-full flex items-center justify-between my-2"
          >
            <p>{{ productStatus ? 'Active' : 'Draft' }}</p>
            <span>
              <ChevronUpDownIcon class="size-5" aria-hidden="true" />
            </span>
          </ListboxButton>
          <div class="relative mt-1">
            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-50 w-full bg-light shadow-lg rounded border border-gray-300"
              >
                <ListboxOption :value="true" v-slot="{ active, selected }" as="template">
                  <li :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-1 cursor-default']">
                    <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                      <CheckIcon class="size-5" aria-hidden="true" />
                    </span>
                    <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                      Active
                    </p>
                  </li>
                </ListboxOption>
                <ListboxOption :value="false" v-slot="{ active, selected }" as="template">
                  <li :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-1 cursor-default']">
                    <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                      <CheckIcon class="size-5" aria-hidden="true" />
                    </span>
                    <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                      Draft
                    </p>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </section>

      <!-- Product organization/collections -->
      <section class="bg-light rounded-xl shadow-lg p-3 min-w-0 md:col-start-3">
        <h2 class="font-semibold mb-4">Product organization</h2>
        <div v-if="collectionsQuery.isPending.value">Loading...</div>
        <div v-else-if="collectionsQuery.isError.value">
          An error has occured: {{ collectionsQuery.error.value }}
        </div>
        <Listbox
          v-else-if="collectionsQuery.data.value"
          v-model="selectedCollections"
          name="selected-collections"
          multiple
        >
          <ListboxLabel>Collections</ListboxLabel>
          <ListboxButton
            class="relative border border-gray-300 rounded p-1 w-full flex items-center justify-between my-1"
          >
            <div v-if="selectedCollections.length" class="flex gap-1 flex-wrap">
              <el-tag v-for="collection in selectedCollections" :key="collection.id">
                <p class="truncate">{{ collection.title }}</p>
              </el-tag>
            </div>
            <p v-else>Select collections</p>
            <span>
              <ChevronUpDownIcon class="size-5" aria-hidden="true" />
            </span>
          </ListboxButton>
          <div class="relative mt-1">
            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-50 w-full bg-light shadow-lg rounded border border-gray-300 divide-y divide-gray-100"
              >
                <template v-if="collections.length">
                  <ListboxOption
                    v-for="collection in collections"
                    :key="collection.id"
                    :value="collection"
                    v-slot="{ active, selected }"
                    as="template"
                  >
                    <li :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-1 cursor-default']">
                      <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                        <CheckIcon class="size-5" aria-hidden="true" />
                      </span>
                      <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                        {{ collection.title }}
                      </p>
                    </li>
                  </ListboxOption>
                </template>
                <ListboxOption v-else disabled class="p-1 opacity-70 cursor-default">
                  Create collections
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </section>
    </div>

    <div class="flex flex-col items-center gap-5 md:col-span-2 md:row-start-2">
      <div v-if="newProductMutation.isPending.value">Creating new product...</div>
      <form
        v-else
        id="newProductForm"
        @submit.prevent="handleSubmit"
        enctype="multipart/form-data"
        class="w-full text-sm flex flex-col gap-5"
      >
        <!-- Title and Description -->
        <TitleAndDescription v-model:title="title" v-model:description="description" />

        <section class="bg-light rounded-xl shadow p-3">
          <h2 class="font-semibold mb-4">Media</h2>

          <div class="flex flex-col gap-1">
            <label for="featured-image">Featured Image</label>
            <ImageInput :model-value="file" />
          </div>

          <div v-if="file">
            <label for="alt"
              >Alt (Optionally provide a brief description of the image for improved
              accessibility)</label
            >
            <input
              id="alt"
              type="text"
              class="border border-gray-300 rounded p-1 w-full mt-1"
              v-model="imageAlt"
            />
          </div>
        </section>

        <Transition name="fade">
          <section v-if="!options.length" class="bg-light rounded-xl shadow p-3">
            <h2 class="font-semibold mb-4">Pricing</h2>
            <label for="price">Price</label>
            <PriceInput
              input-id="price"
              v-model="defaultVariant.price"
              :locale="currencyInfo.locale"
              :currency-symbol="currencyInfo.symbol"
              :required="!isEditVariantOpen"
            />
          </section>
        </Transition>

        <Transition name="fade">
          <InventoryPanel
            v-if="!options.length"
            v-model:sku="defaultVariant.sku"
            v-model:quantity="defaultVariant.quantity"
            :is-quantity-required="!isEditVariantOpen"
          />
        </Transition>

        <!-- Options section -->
        <section class="bg-light rounded-xl shadow-lg">
          <div class="p-3 border-b border-gray-200">
            <h2 class="font-semibold">Options</h2>
            <p class="text-xs">Define options for the product, e.g. size, color, etc.</p>
          </div>
          <CreateProductOptionsPanel v-model:options="options" v-model:variants="variants" />
        </section>

        <!-- Variants table -->
        <Transition name="fade">
          <section
            v-if="validOptions.length"
            class="bg-light outline outline-gray-200 rounded-xl shadow"
          >
            <EditNewProductVariant
              v-model:is-open="isEditVariantOpen"
              :currency-symbol="currencyInfo.symbol"
              :id="activeEditVariant?.id"
              :inventory-quantity="activeEditVariant?.inventoryQuantity"
              :sku="activeEditVariant?.sku"
              :price="activeEditVariant?.price"
              @save="saveVariantEdit"
              @cancel="cancelVariantEdit"
            />
            <div>
              <TanstackTable :table="variantsTable" :is-loading="false" :include-headers="true" />
            </div>
          </section>
        </Transition>
      </form>
    </div>
  </div>
</template>

<style lang="css" scoped>
.grid-container {
  grid-template-rows: min-content auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
