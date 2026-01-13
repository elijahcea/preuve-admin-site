<script setup lang="tsx">
import TableComponent from '@/components/TableComponent.vue';
import CheckboxComponent from '@/components/CheckboxComponent.vue';
import { useVueTable, createColumnHelper, getCoreRowModel, getSortedRowModel, type RowSelectionState } from '@tanstack/vue-table';
import { computed, ref } from 'vue';

type Product = {
    id: string;
    name: string;
    price: number
}

const rowSelection = ref<RowSelectionState>({});
const selectedRowId = computed(() => {
    const keys = Object.keys(rowSelection.value);
    return keys.length === 1 ? keys[0] : undefined;
});

const columnHelper = createColumnHelper<Product>();

const columns = [
    columnHelper.display({
        id: "select-col",
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
        )
    }),
    columnHelper.accessor("name", {
        header: "Product",
        sortingFn: "alphanumeric"
    }),
    columnHelper.accessor("price", {
        header: "Price",
        enableSorting: false
    }),
    columnHelper.accessor("id", {
        header: "ID",
        enableSorting: false
    })
]

const data = ref<Product[]>([
    {
        id: "1",
        name: "shirt",
        price: 20
    },
    {
        id: "2",
        name: "shorts",
        price: 30
    }
]);

const table = useVueTable({ 
    columns,
    data,
    state: {
        get rowSelection() {
            return rowSelection.value;
        }
    },
    enableRowSelection: true,
    onRowSelectionChange: (updateOrValue) => {
        rowSelection.value =
            typeof updateOrValue === 'function'
                ? updateOrValue(rowSelection.value)
                : updateOrValue
    },
    getRowId: row => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
});
</script>

<template>
    <div class="flex flex-col align-start gap-3">
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold">Products</h1>
            <component
                :is="selectedRowId ? 'RouterLink' : 'span'"
                :class="'font-bold rounded p-2 bg-blue-400 ' + `${selectedRowId ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`"
                :to="{
                    name: 'modifyProduct',
                    params: { id: selectedRowId }
                }"
            >
                Modify
            </component>
        </div>
        <TableComponent :table="table" />
    </div>
</template>