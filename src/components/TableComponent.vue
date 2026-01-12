<script setup lang="ts" generic="T">
import { type Table, FlexRender } from '@tanstack/vue-table';
const props = defineProps<{ table: Table<T> }>();
const table = props.table;
</script>

<template>
    <table class="bg-background rounded shadow border-collapse table-auto">
        <thead>
            <tr
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
            >
                <th 
                    v-for="header in headerGroup.headers" 
                    :key="header.id" 
                    :colspan="header.colSpan"
                    :class="`text-start opacity-75 border-t border-t-gray-200 p-2 ` + `${header.column.getCanSort() ? 'cursor-pointer select-none bg-gray-100' : 'bg-gray-100'}`"
                    @click="header.column.getToggleSortingHandler()?.($event)"
                >
                    <FlexRender
                        :render="header.column.columnDef.header"
                        :props="header.getContext()"
                    />
                </th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="row in table.getRowModel().rows"
                :key="row.id"
            >
                <td
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                    class="font-bold border-t border-t-gray-200 p-2"
                >
                    <FlexRender
                        :render="cell.column.columnDef.cell"
                        :props="cell.getContext()"
                    />
                </td>
            </tr>
        </tbody>
    </table>
</template>