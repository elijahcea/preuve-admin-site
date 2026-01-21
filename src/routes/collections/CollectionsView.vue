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

type Collection = {
  id: string
  name: string
  description: string
}

const rowSelection = ref<RowSelectionState>({})
const selectedRowId = computed(() => {
  const keys = Object.keys(rowSelection.value)
  return keys.length === 1 ? keys[0] : undefined
})

const columnHelper = createColumnHelper<Collection>()

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

const data = ref<Collection[]>([
  {
    id: '1',
    name: "Men's",
    description: "Men's clothing",
  },
  {
    id: '2',
    name: "Women's",
    description: "Women's clothing",
  },
])

const table = useVueTable({
  columns,
  data,
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
    <TableComponent :table="table" />
  </div>
</template>
