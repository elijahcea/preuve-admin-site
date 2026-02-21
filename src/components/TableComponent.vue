<script setup lang="ts" generic="T">
import { type Table, FlexRender } from '@tanstack/vue-table'

const props = defineProps<{ table: Table<T> }>()
const table = props.table
</script>

<template>
  <div class="border border-gray-200 rounded-2xl shadow overflow-hidden">
    <table class="bg-light min-w-full border-collapse table-auto">
      <thead>
        <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :colspan="header.colSpan"
            :class="
              `bg-(--table-header-bg text-start border-b border-b-gray-200 p-3 ` +
              `${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`
            "
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id">
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :class="
              `font-bold border-t border-t-gray-200 p-3 ` +
              `${row.getIsSelected() ? `bg-blue-300/50` : ``}`
            "
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="css" scoped>
table {
  --table-bg: #f1f1f1;
  --table-header-bg: #ebebeb;
}
</style>
