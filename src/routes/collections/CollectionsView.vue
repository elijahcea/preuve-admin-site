<script setup lang="tsx">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
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
import { type CollectionPreview } from '@/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchCollections } from '@/api/queries'
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { deleteCollection } from '@/api/mutations'
import { ElMessageBox, ElNotification } from 'element-plus'

const tableData = ref<CollectionPreview[]>([])
const rowSelection = ref<RowSelectionState>({})
const isLoading = ref(false)

const selectedRowId = computed(() => {
  const keys = Object.keys(rowSelection.value)
  return keys.length === 1 ? keys[0] : undefined
})
const isSomeRowsSelected = computed(() => Boolean(Object.keys(rowSelection.value).length))

const columnHelper = createColumnHelper<CollectionPreview>()

const queryClient = useQueryClient()

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

const deleteCollectionMutation = useMutation({
  mutationFn: (collectionId: string) => deleteCollection(collectionId),
})

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
  columnHelper.accessor('title', {
    header: 'Collection',
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

const openConfirmPopover = () => {
  ElMessageBox.confirm('This action will permanently delete collections. Continue?', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => handleDeleteCollections())
    .catch((reason) => console.log(reason))
}

const revalidateCollections = async () => {
  try {
    await queryClient.invalidateQueries({ queryKey: ['collections'] }, { throwOnError: true })
    if (queryData.value) {
      tableData.value = queryData.value.collections
    }
  } catch (e) {
    ElNotification({
      title: 'Error refetching collections',
      message: `${e}`,
      type: 'error',
      position: 'bottom-right',
    })
  }
}

const handleDeleteCollections = async () => {
  try {
    isLoading.value = true

    const collectionIds = Object.keys(rowSelection.value)
    const results = await Promise.allSettled(
      collectionIds.map((id) => {
        return deleteCollectionMutation.mutateAsync(id)
      }),
    )

    const rejectedPromises = results.filter((promise) => promise.status === 'rejected')

    if (rejectedPromises.length) {
      ElNotification({
        title: 'Error deleting collections',
        message:
          rejectedPromises.length > 1
            ? `Failed to delete ${rejectedPromises.length} collections`
            : `Failed to delete ${rejectedPromises.length} collection`,
        type: 'error',
        position: 'bottom-right',
      })
    } else {
      ElNotification({
        title: 'Success',
        message: `Successfully deleted collections`,
        type: 'success',
        position: 'bottom-right',
      })
    }

    await revalidateCollections()

    table.resetRowSelection(true)
    isLoading.value = false
  } catch (e) {
    console.log(e)
    ElNotification({
      title: `Error deleting collections`,
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
      tableData.value = queryData.value.collections
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex flex-col align-start gap-3">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold">Collections</h1>
      <div class="flex gap-3">
        <Menu as="div" class="relative">
          <MenuButton class="bg-cool-gray font-bold rounded py-1 px-2">
            <span>More actions</span>
            <ChevronDownIcon class="size-5 inline-block font-bold ml-1" aria-hidden="true" />
          </MenuButton>
          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute p-1 mt-0.5 w-full rounded bg-white shadow-lg divide-y divide-gray-100"
            >
              <MenuItem v-slot="{ active }" :disabled="!selectedRowId">
                <component
                  :is="selectedRowId ? 'RouterLink' : 'span'"
                  :to="{
                    name: 'collectionDetails',
                    params: { id: selectedRowId },
                  }"
                >
                  <button
                    :class="[
                      { 'bg-cool-gray': active },
                      'flex items-center gap-1 w-full font-semibold rounded-md p-2',
                      `${selectedRowId ?? 'opacity-50'}`,
                    ]"
                    type="button"
                  >
                    <PencilSquareIcon class="size-4" aria-disabled="true" />
                    Edit
                  </button>
                </component>
              </MenuItem>
              <MenuItem v-slot="{ active }" :disabled="!isSomeRowsSelected">
                <button
                  :disabled="!isSomeRowsSelected"
                  :class="[
                    { 'bg-cool-gray': active },
                    'flex items-center gap-1 w-full font-semibold rounded-md p-2',
                    `${!isSomeRowsSelected ? 'opacity-50' : ''}`,
                  ]"
                  type="button"
                  @click.prevent="openConfirmPopover"
                >
                  <TrashIcon class="size-4" aria-disabled="true" />
                  Delete
                </button>
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
        <button class="font-bold rounded-md py-1 px-2 bg-fill text-background hover:opacity-80">
          <RouterLink
            :to="{
              name: 'newCollection',
            }"
          >
            Create collection
          </RouterLink>
        </button>
      </div>
    </div>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">Something went wrong: {{ error }}</div>
    <TableComponent v-else-if="queryData" :table="table" :is-loading="isLoading" />
  </div>
</template>
