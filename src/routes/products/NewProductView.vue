<script setup lang="tsx">
import { computed, ref, watch } from 'vue'
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
import TableComponent from '@/components/TableComponent.vue'
import InventoryPanel from '@/components/InventoryPanel.vue'
import { postNewProduct } from '@/api/mutations'
import router from '@/router'
import { createColumnHelper, useVueTable, getCoreRowModel } from '@tanstack/vue-table'
import PriceInput from '@/components/PriceInput.vue'
import EditVariantDialog from '@/components/dialogs/EditVariantDialog.vue'
import PriceCell from '@/components/cells/PriceCell.vue'
import { ElNotification, ElTag } from 'element-plus'

const title = ref('')
const description = ref('')
const collections = ref<CollectionPreview[]>([])
const selectedCollections = ref<CollectionPreview[]>([])
const productStatus = ref(false)
const defaultVariant = ref({
  price: null,
  sku: null,
  quantity: null,
})
const options = ref<OptionCreateForm[]>([])
const variants = ref<ProductVariantCreateForm[]>([])
const isEditVariantOpen = ref(false)
const activeEditVariantId = ref()
const isLoading = ref(false)

const validOptions = computed(() =>
  options.value.filter((option) => option.values.some((value) => value.name.length)),
)
const activeEditVariant = computed(() =>
  variants.value.find((v) => v.id === activeEditVariantId.value),
)

const queryClient = useQueryClient()
const columnHelper = createColumnHelper<ProductVariantCreateForm>()

const {
  isPending,
  isError,
  data: queryData,
  isSuccess,
  error,
} = useQuery({
  queryKey: ['collections'],
  queryFn: fetchCollections,
})

const newProductMutation = useMutation({
  mutationFn: (newProduct: ProductCreateDTO) => postNewProduct(newProduct),
  onSuccess: (data) => {
    const { product } = data
    router.push({ name: 'productDetails', params: { id: product.id } })
  },
})

const columns = [
  columnHelper.accessor((row) => row.optionValues.map((value) => value.name).join(' / '), {
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

const saveVariantEdit = (updatedVariantInfo: Omit<ProductVariantCreateForm, 'optionValues'>) => {
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
      title: 'Error refetching products',
      message: `${e}`,
      type: 'error',
      position: 'bottom-right',
    })
  }
}

const handleSubmit = async () => {
  try {
    isLoading.value = true
    if (options.value.length < 1) {
      if (!defaultVariant.value.price || !defaultVariant.value.quantity) {
        throw new Error(`Missing input for price and/or quantity.`)
      }
      await newProductMutation.mutate({
        status: productStatus.value,
        title: title.value,
        description: description.value,
        featuredImage: null,
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
            sku: defaultVariant.value.sku,
            price: defaultVariant.value.price,
            inventoryQuantity: defaultVariant.value.quantity,
            optionValues: [
              {
                name: 'Default option value',
                optionName: 'Default option',
              },
            ],
          },
        ],
      })
    } else {
      await newProductMutation.mutate({
        status: productStatus.value,
        title: title.value,
        description: description.value,
        featuredImage: null,
        collectionIds: selectedCollections.value.map((collection) => collection.id),
        options: options.value.map((option) => ({
          name: option.name,
          values: option.values.map((value) => ({
            name: value.name,
          })),
        })),
        variants: variants.value.map((variant) => {
          return {
            sku: variant.sku,
            price: variant.price,
            inventoryQuantity: variant.inventoryQuantity,
            optionValues: variant.optionValues.map((value) => {
              const parentOption = options.value.find((option) => option.id === value.optionId)
              if (!parentOption) throw new Error('Option value requires parent option name')
              return {
                name: value.name,
                optionName: parentOption.name,
              }
            }),
          }
        }),
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
      type: 'error',
      position: 'bottom-right',
    })
    isLoading.value = false
  }
}

watch(
  isSuccess,
  (isSuccess) => {
    if (isSuccess && queryData.value) {
      collections.value = queryData.value.collections
    }
  },
  { immediate: true },
)
</script>

<template>
  <!-- Heading -->
  <div v-loading="isLoading" class="max-w-4xl mx-auto mb-5 grid grid-cols-3 gap-5 grid-container">
    <div class="flex items-center w-full gap-3">
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
    <div class="col-start-3">
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

    <div class="flex flex-col gap-3 col-start-3">
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
      <section class="bg-light rounded-xl shadow-lg p-3 min-w-0 col-start-3">
        <h2 class="font-semibold mb-4">Product organization</h2>
        <div v-if="isPending">Loading...</div>
        <div v-else-if="isError">An error has occured: {{ error }}</div>
        <Listbox
          v-else-if="queryData"
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

    <div class="flex flex-col items-center gap-5 col-span-2 row-start-2">
      <div v-if="newProductMutation.isPending.value">Creating new product...</div>
      <form
        v-else
        id="newProductForm"
        @submit.prevent="handleSubmit"
        class="w-full text-sm flex flex-col gap-5"
      >
        <!-- Title and Description -->
        <TitleAndDescription v-model:title="title" v-model:description="description" />

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
            <EditVariantDialog
              v-model:is-open="isEditVariantOpen"
              :currency-symbol="currencyInfo.symbol"
              :variant-id="activeEditVariant?.id"
              :inventory-quantity="activeEditVariant?.inventoryQuantity"
              :sku="activeEditVariant?.sku"
              :price="activeEditVariant?.price"
              @save-variant-edit="saveVariantEdit"
              @cancel-edit="cancelVariantEdit"
            />
            <div>
              <TableComponent :table="variantsTable" :is-loading="false" :include-headers="true" />
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
