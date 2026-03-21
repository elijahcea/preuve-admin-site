<script setup lang="tsx">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { currencyInfo } from '@/lib/currencyInfo'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronUpDownIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
} from '@heroicons/vue/24/outline'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { fetchCollections, fetchProduct } from '@/api/queries'
import StatusLabel from '@/components/StatusLabel.vue'
import {
  type ProductVariant,
  type CollectionPreview,
  type ProductOption,
  type ProductUpdateDTO,
} from '@/lib/types'
import router from '@/router'
import { updateProduct } from '@/api/mutations'
import { ElTag } from 'element-plus'
import { createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import TableComponent from '@/components/TableComponent.vue'
import TagCell from '@/components/cells/TagCell.vue'
import PriceCell from '@/components/cells/PriceCell.vue'

const props = defineProps<{
  id: string
}>()

const title = ref('')
const description = ref('')
const selectedCollections = ref<CollectionPreview[]>([])
const productStatus = ref(false)
const hasOnlyDefaultVariant = ref(true)
const activeEditVariantId = ref()
const isEditVariantOpen = ref(false)

const optionsTableData = computed(() => productQuery.data.value?.product.options ?? [])
const variantsTableData = computed(() => productQuery.data.value?.product.variants ?? [])
const collections = computed(() => collectionsQuery.data.value?.collections ?? [])
const activeEditVariant = computed(() =>
  variantsTableData.value.find((v) => v.id === activeEditVariantId.value),
)

const optionColumnHelper = createColumnHelper<ProductOption>()
const variantColumnHelper = createColumnHelper<ProductVariant>()

const productQuery = useQuery({
  queryKey: ['products', () => props.id],
  queryFn: () => fetchProduct(props.id),
})

const collectionsQuery = useQuery({
  queryKey: ['collections'],
  queryFn: fetchCollections,
})

const updateProductMutation = useMutation({
  mutationFn: (updatedProduct: ProductUpdateDTO) => updateProduct(props.id, updatedProduct),
  onSuccess: (data) => {
    const { product } = data
    router.push({ name: 'productDetails', params: { id: product.id } })
  },
})

const optionColumns = [
  optionColumnHelper.accessor('name', {
    header: 'Name',
  }),
  optionColumnHelper.accessor('values', {
    header: 'Values',
    cell: (props) => (
      <TagCell
        tagItems={props.getValue().map((v) => {
          return {
            name: v.name,
            key: v.id,
          }
        })}
      />
    ),
  }),
  optionColumnHelper.display({
    id: 'actions',
    cell: (props) => (
      <div class="text-end">
        <button type="button" class="rounded-md py-1 px-2 hover:bg-cool-gray">
          <EllipsisHorizontalIcon class="size-5" />
        </button>
      </div>
    ),
  }),
]

const variantColumns = [
  variantColumnHelper.accessor(
    (row) => row.selectedOptions.map((value) => value.name).join(' / '),
    {
      header: 'Title',
    },
  ),
  variantColumnHelper.accessor('sku', {
    header: 'SKU',
  }),
  variantColumnHelper.accessor('price', {
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
  variantColumnHelper.accessor('inventoryQuantity', {
    header: 'Inventory',
    sortingFn: 'alphanumeric',
  }),
  variantColumnHelper.display({
    id: 'actions',
    cell: (props) => (
      <div class="text-end">
        <button type="button" class="rounded-md py-1 px-2 hover:bg-cool-gray">
          <EllipsisHorizontalIcon class="size-5" />
        </button>
      </div>
    ),
  }),
]

const optionTable = useVueTable({
  columns: optionColumns,
  data: optionsTableData,
  enableSorting: false,
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
})

const variantsTable = useVueTable({
  columns: variantColumns,
  data: variantsTableData,
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
})

const handleSubmit = () => {}

watch(
  productQuery.isSuccess,
  (isSuccess) => {
    if (isSuccess && productQuery.data.value) {
      const product = productQuery.data.value.product

      title.value = product.title
      description.value = product.description
      selectedCollections.value = product.collections
      productStatus.value = product.status
      hasOnlyDefaultVariant.value = product.hasOnlyDefaultVariant
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="productQuery.isPending.value">Loading...</div>
  <div v-else-if="productQuery.isError.value">
    An error has occured: {{ productQuery.error.value }}
  </div>

  <!-- Heading -->
  <template v-else-if="productQuery.data.value">
    <div
      v-loading="productQuery.isPending.value"
      class="max-w-4xl mx-auto mb-5 grid grid-cols-3 gap-5 grid-container"
    >
      <div class="flex items-center w-full gap-3">
        <RouterLink
          :to="{ name: 'products' }"
          class="p-1 hover:bg-current/20 rounded border border-gray-400"
        >
          <ArrowLeftIcon class="size-5" />
        </RouterLink>
        <h1 class="font-bold text-xl truncate">{{ title }}</h1>
        <StatusLabel :status="productStatus" />
      </div>

      <div class="flex flex-col gap-3 col-start-3 row-start-2">
        <!-- Product status -->
        <section class="bg-light rounded-xl shadow-lg">
          <Listbox
            as="div"
            class="divide-y divide-gray-200"
            v-model="productStatus"
            name="product-status"
          >
            <div class="flex items-center justify-between p-3">
              <ListboxLabel class="font-semibold">Product status</ListboxLabel>
              <button type="button" class="rounded-md py-1 px-2 hover:bg-cool-gray">
                <EllipsisHorizontalIcon class="size-5" />
              </button>
            </div>
            <div class="p-3">
              <ListboxButton
                class="relative border border-gray-300 rounded p-1 w-full flex items-center justify-between my-1"
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
                      <li
                        :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-1 cursor-default']"
                      >
                        <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                          <CheckIcon class="size-5" aria-hidden="true" />
                        </span>
                        <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                          Active
                        </p>
                      </li>
                    </ListboxOption>
                    <ListboxOption :value="false" v-slot="{ active, selected }" as="template">
                      <li
                        :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-1 cursor-default']"
                      >
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
            </div>
          </Listbox>
        </section>

        <!-- Product organization/collections -->
        <div v-if="collectionsQuery.isPending.value">Loading...</div>
        <div v-else-if="collectionsQuery.isError.value">
          An error has occured: {{ collectionsQuery.error.value }}
        </div>

        <section
          v-else-if="collectionsQuery.data.value"
          class="bg-light rounded-xl shadow-lg divide-y divide-gray-200 min-w-0 col-start-3"
        >
          <div class="flex items-center justify-between p-3">
            <h2 class="font-semibold">Product organization</h2>
            <button type="button" class="rounded-md py-1 px-2 hover:bg-cool-gray">
              <EllipsisHorizontalIcon class="size-5" />
            </button>
          </div>
          <Listbox
            as="div"
            v-model="selectedCollections"
            name="selected-collections"
            multiple
            class="p-3"
          >
            <ListboxLabel>Collections</ListboxLabel>
            <ListboxButton
              class="relative border border-gray-300 rounded p-2 w-full flex items-center justify-between my-1"
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
                  class="absolute z-50 w-full bg-light shadow-lg rounded border border-gray-300"
                >
                  <template v-if="collections.length">
                    <ListboxOption
                      v-for="collection in collections"
                      :key="collection.id"
                      :value="selectedCollections.find((c) => collection.id === c.id) ?? collection"
                      v-slot="{ active, selected }"
                      as="template"
                    >
                      <li
                        :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-2 cursor-default']"
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
                  <ListboxOption v-else disabled class="p-2 opacity-70 cursor-default">
                    Create collections
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </section>
      </div>

      <div class="flex flex-col items-center gap-5 col-span-2 row-start-2">
        <!-- Title and description section -->
        <section class="w-full bg-light rounded-xl shadow-lg">
          <div class="flex items-center justify-between p-3 border-b border-b-gray-200">
            <h2 class="font-semibold">Product info</h2>
            <button type="button" class="rounded-md py-1 px-2 hover:bg-cool-gray">
              <EllipsisHorizontalIcon class="size-5" />
            </button>
          </div>
          <div class="p-3">
            <p>Title</p>
            <p id="title" class="border border-gray-300 rounded p-1 w-full mt-1">
              {{ title }}
            </p>
          </div>
          <div class="p-3">
            <p>Description</p>
            <p id="description" class="resize-none border border-gray-300 rounded p-1 w-full mt-1">
              {{ description }}
            </p>
          </div>
        </section>

        <!-- Options section -->
        <section class="w-full bg-light rounded-xl shadow-lg overflow-hidden">
          <div class="flex items-center justify-between p-3 border-b border-b-gray-200">
            <h2 class="font-semibold">Options</h2>
            <button
              type="button"
              class="bg-light outline outline-gray-200 rounded-md py-1 px-2 hover:bg-cool-gray"
            >
              Create
            </button>
          </div>

          <TableComponent
            v-if="optionsTableData.length"
            :table="optionTable"
            :is-loading="false"
            :include-headers="false"
          />
        </section>

        <section class="w-full bg-light outline outline-gray-200 rounded-xl shadow overflow-hidden">
          <div class="flex items-center justify-between p-3 border-b border-b-gray-200">
            <h2 class="font-semibold">Variants</h2>
            <button
              type="button"
              class="bg-light outline outline-gray-200 rounded-md py-1 px-2 hover:bg-cool-gray"
            >
              Create
            </button>
          </div>

          <TableComponent
            v-if="variantsTableData.length"
            :table="variantsTable"
            :is-loading="false"
            :include-headers="true"
          />
        </section>
      </div>
    </div>
  </template>
</template>

<style lang="css" scoped>
.grid-container {
  grid-template-rows: min-content auto;
}
</style>
