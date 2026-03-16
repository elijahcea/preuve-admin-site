<script setup lang="ts">
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
import { ArrowLeftIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import { fetchCollections } from '@/api/queries'
import { useMutation, useQuery } from '@tanstack/vue-query'
import TitleAndDescription from '@/components/TitleAndDescription.vue'
import StatusLabel from '@/components/StatusLabel.vue'
import PricingPanel from '@/components/PricingPanel.vue'
import CreateProductOptionsPanel from '@/components/CreateProductOptionsPanel.vue'
import TableComponent from '@/components/TableComponent.vue'
import InventoryPanel from '@/components/InventoryPanel.vue'
import { postNewProduct } from '@/api/mutations'
import router from '@/router'
import { createColumnHelper, useVueTable, getCoreRowModel } from '@tanstack/vue-table'

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

const validOptions = computed(() =>
  options.value.filter((option) => option.values.some((value) => value.name.length)),
)

const columnHelper = createColumnHelper<ProductVariantCreateForm>()
const { symbol } = currencyInfo

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
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor((row) => row.optionValues.map((value) => value.name).join(' / '), {
    header: 'Title',
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('inventoryQuantity', {
    header: 'Inventory',
    sortingFn: 'alphanumeric',
  }),
]

const variantsTable = useVueTable({
  columns,
  data: variants,
  getCoreRowModel: getCoreRowModel(),
})

const handleSubmit = () => {
  if (options.value.length < 1) {
    if (!defaultVariant.value.price) {
      throw new Error('Price cannot be null')
    }
    if (!defaultVariant.value.quantity) {
      throw new Error('Quantity cannot be null')
    }
    newProductMutation.mutate({
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
    newProductMutation.mutate({
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
  <div class="max-w-4xl mx-auto mb-5 grid grid-cols-3 gap-5">
    <div class="flex flex-col items-center gap-5 col-span-2">
      <div class="flex items-center w-full gap-3">
        <RouterLink
          :to="{ name: 'products' }"
          class="p-1 hover:bg-current/20 rounded border border-gray-400"
        >
          <ArrowLeftIcon class="size-5" />
        </RouterLink>
        <h1 class="font-bold text-xl truncate">{{ title || 'Title' }}</h1>
        <StatusLabel :status="productStatus" />
      </div>

      <div v-if="newProductMutation.isPending.value">Creating new product...</div>
      <form
        v-else
        id="newProductForm"
        @submit.prevent="handleSubmit"
        class="w-full text-sm flex flex-col gap-5"
      >
        <!-- Title and Description -->
        <TitleAndDescription v-model:title="title" v-model:description="description" />

        <PricingPanel v-model="defaultVariant.price" :currency-symbol="symbol" />
        <InventoryPanel
          v-model:sku="defaultVariant.sku"
          v-model:quantity="defaultVariant.quantity"
        />

        <!-- Product organization/collections -->
        <section class="bg-light rounded-xl shadow-lg p-3 min-w-0">
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
                <div
                  v-for="collection in selectedCollections"
                  :key="collection.id"
                  class="rounded-xl border border-blue-900 bg-blue-100 max-w-xs p-0.5"
                >
                  <p class="truncate">{{ collection.title }}</p>
                </div>
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
                      <li
                        :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-1 cursor-default']"
                      >
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

        <!-- Options section -->
        <section class="bg-light rounded-xl shadow-lg">
          <div class="p-3 border-b border-gray-200">
            <h2 class="font-semibold">Options</h2>
            <p class="text-xs">Define options for the product, e.g. size, color, etc.</p>
          </div>
          <CreateProductOptionsPanel v-model:options="options" v-model:variants="variants" />
        </section>

        <!-- Variants table -->
        <section v-if="validOptions.length">
          <TableComponent :table="variantsTable" :is-loading="false" />
        </section>
      </form>
    </div>
    <div>
      <!-- Save changes or discard buttons -->
      <div class="mb-3.5">
        <RouterLink :to="{ name: 'products' }">
          <button class="font-semibold rounded bg-cool-gray py-1 px-2 hover:opacity-80">
            Discard
          </button>
        </RouterLink>
        <button
          type="submit"
          form="newProductForm"
          class="font-bold rounded py-1 px-2 ml-2 bg-fill text-background hover:opacity-80"
        >
          Save
        </button>
      </div>
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
    </div>
  </div>
</template>
