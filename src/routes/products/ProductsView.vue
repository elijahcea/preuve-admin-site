<script setup lang="tsx">
import { type ProductPreview } from '@/lib/types'
import TableComponent from '@/components/TableComponent.vue'
import CheckboxComponent from '@/components/CheckboxComponent.vue'
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type RowSelectionState,
} from '@tanstack/vue-table'
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchProducts } from '@/api/queries'

const {
  isPending,
  isError,
  data: queryData,
  isSuccess,
  error,
} = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

const tableData = ref<ProductPreview[]>([])

watch(
  isSuccess,
  (isSuccess) => {
    if (isSuccess && queryData.value) {
      tableData.value = queryData.value
    }
  },
  { immediate: true },
)

const rowSelection = ref<RowSelectionState>({})
const selectedRowId = computed(() => {
  const keys = Object.keys(rowSelection.value)
  return keys.length === 1 ? keys[0] : undefined
})

const columnHelper = createColumnHelper<ProductPreview>()

const columns = [
  columnHelper.display({
    id: 'select-col',
    header: ({ table }) => (
      <CheckboxComponent
        checked={table.getIsAllRowsSelected()}
        intederminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      ></CheckboxComponent>
    ),
    cell: ({ row }) => (
      <CheckboxComponent
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      ></CheckboxComponent>
    ),
  }),
  columnHelper.accessor('name', {
    header: 'Product',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    enableSorting: false,
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    enableSorting: false,
  }),
]

const table = useVueTable({
  columns,
  data: tableData,
  state: {
    get rowSelection() {
      return rowSelection.value
    },
  },
  enableRowSelection: true,
  onRowSelectionChange: (updateOrValue) => {
    rowSelection.value =
      typeof updateOrValue === 'function' ? updateOrValue(rowSelection.value) : updateOrValue
  },
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

const isSomeRowsSelected = computed(() => Boolean(Object.keys(rowSelection.value).length))
</script>

<template>
  <div class="flex flex-col align-start gap-3">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold">Products</h1>
      <div class="flex gap-3">
        <component
          :is="isSomeRowsSelected ? 'button' : 'span'"
          :class="
            'font-bold rounded p-2 bg-red-400 ' +
            `${isSomeRowsSelected ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`
          "
        >
          Delete
        </component>
        <component
          :is="selectedRowId ? 'RouterLink' : 'span'"
          :class="
            'font-bold rounded p-2 bg-blue-400 ' +
            `${selectedRowId ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`
          "
          :to="{
            name: 'productDetails',
            params: { id: selectedRowId },
          }"
        >
          Modify
        </component>
        <RouterLink
          class="font-bold rounded p-2 bg-blue-400 hover:opacity-80"
          :to="{
            name: 'newProduct',
          }"
        >
          Create product
        </RouterLink>
      </div>
    </div>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">An error has occured: {{ error }}</div>
    <TableComponent v-else-if="queryData" :table="table" />
  </div>
</template>
