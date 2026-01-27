<script setup lang="tsx">
import TableComponent from '@/components/TableComponent.vue'
import CheckboxComponent from '@/components/CheckboxComponent.vue'
import {
  useVueTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type RowSelectionState,
} from '@tanstack/vue-table'
import { computed, ref } from 'vue'
import { type CollectionPreview } from '@/lib/types'
import { useQuery } from '@tanstack/vue-query'
import { fetchCollections } from '@/api/queries'

const {
  isPending,
  isError,
  data: queryData,
  error,
} = useQuery({
  queryKey: ['collections'],
  queryFn: fetchCollections,
})

const tableData = computed(() => queryData.value ?? [])

const rowSelection = ref<RowSelectionState>({})
const selectedRowId = computed(() => {
  const keys = Object.keys(rowSelection.value)
  return keys.length === 1 ? keys[0] : undefined
})

const columnHelper = createColumnHelper<CollectionPreview>()

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
    header: 'Title',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    enableSorting: false,
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    sortingFn: 'alphanumeric',
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
      <h1 class="text-xl font-bold">Collections</h1>
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
            name: 'collectionDetails',
            params: { id: selectedRowId },
          }"
        >
          Modify
        </component>
        <RouterLink
          class="font-bold rounded p-2 bg-blue-400 hover:opacity-80"
          :to="{
            name: 'newCollection',
          }"
        >
          Create collection
        </RouterLink>
      </div>
    </div>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">Something went wrong: {{ error }}</div>
    <TableComponent v-else-if="queryData" :table="table" />
  </div>
</template>
