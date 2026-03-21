<script setup lang="tsx">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
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
import { computed, ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchProducts } from '@/api/queries'
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { deleteProduct } from '@/api/mutations'
import { ElMessageBox, ElNotification } from 'element-plus'
import { RouterLink } from 'vue-router'

const rowSelection = ref<RowSelectionState>({})
const isLoading = ref(false)

const tableData = computed(() => queryData.value?.products ?? [])
const selectedRowId = computed(() => {
  const keys = Object.keys(rowSelection.value)
  return keys.length === 1 ? keys[0] : undefined
})
const isSomeRowsSelected = computed(() => Boolean(Object.keys(rowSelection.value).length))

const columnHelper = createColumnHelper<ProductPreview>()

const queryClient = useQueryClient()

const {
  isPending,
  isError,
  data: queryData,
  error,
} = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

const deleteProductMutation = useMutation({
  mutationFn: (productId: string) => deleteProduct(productId),
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
    header: 'Product',
    sortingFn: 'alphanumeric',
    cell: (props) => (
      <button type="button" class="w-full text-start">
        <RouterLink to={{ name: 'productDetails', params: { id: props.row.id } }}>
          {props.getValue()}
        </RouterLink>
      </button>
    ),
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

const openConfirmPopover = () => {
  ElMessageBox.confirm('This action will permanently delete products. Continue?', {
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    type: 'warning',
  })
    .then(() => handleDeleteProducts())
    .catch((reason) => console.log(reason))
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

const handleDeleteProducts = async () => {
  try {
    isLoading.value = true

    const productIds = Object.keys(rowSelection.value)
    const results = await Promise.allSettled(
      productIds.map((id) => {
        return deleteProductMutation.mutateAsync(id)
      }),
    )

    const rejectedPromises = results.filter((promise) => promise.status === 'rejected')

    if (rejectedPromises.length) {
      ElNotification({
        title: 'Error deleting products',
        message:
          rejectedPromises.length > 1
            ? `Failed to delete ${rejectedPromises.length} products`
            : `Failed to delete ${rejectedPromises.length} product`,
        type: 'error',
        position: 'bottom-right',
      })
    } else {
      ElNotification({
        title: 'Success',
        message: `Successfully deleted products`,
        type: 'success',
        position: 'bottom-right',
      })
    }

    await revalidateProducts()

    table.resetRowSelection(true)
    isLoading.value = false
  } catch (e) {
    console.log(e)
    ElNotification({
      title: 'Error deleting products',
      type: 'error',
      position: 'bottom-right',
    })
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col align-start gap-3">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Products</h1>
      <div class="flex gap-3">
        <Menu as="div" class="relative">
          <MenuButton class="bg-cool-gray font-medium rounded py-1 px-2">
            <span>More actions</span>
            <ChevronDownIcon class="size-5 inline-block ml-1" aria-hidden="true" />
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
                    name: 'productDetails',
                    params: { id: selectedRowId },
                  }"
                >
                  <button
                    :class="[
                      { 'bg-cool-gray': active },
                      'flex items-center gap-1 w-full font-medium rounded-md p-2',
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
                    'flex items-center gap-1 w-full font-medium rounded-md p-2',
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
        <button class="font-medium rounded-md py-1 px-2 bg-fill text-background hover:opacity-80">
          <RouterLink
            :to="{
              name: 'newProduct',
            }"
          >
            Create product
          </RouterLink>
        </button>
      </div>
    </div>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">An error has occured: {{ error }}</div>
    <div
      v-else-if="queryData"
      class="bg-light outline outline-gray-200 rounded-xl shadow overflow-hidden"
    >
      <TableComponent :table="table" :is-loading="isLoading" :include-headers="true" />
    </div>
  </div>
</template>
