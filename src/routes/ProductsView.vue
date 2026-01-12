<script setup lang="ts">
import TableComponent from '@/components/TableComponent.vue';
import { useVueTable, createColumnHelper, getCoreRowModel, getSortedRowModel } from '@tanstack/vue-table';
import { ref } from 'vue';

type Product = {
    id: string;
    name: string;
    price: number
}

const columnHelper = createColumnHelper<Product>();

const columns = [
    columnHelper.display({
        id: "select",
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
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
});
</script>

<template>
    <div class="flex flex-col align-start gap-3">
        <h1 class="text-xl font-bold">Products</h1>
        <TableComponent :table="table" />
    </div>
</template>