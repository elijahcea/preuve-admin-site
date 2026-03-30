<script setup lang="ts" generic="T">
import { type Table, FlexRender } from '@tanstack/vue-table'

const {
  table,
  isLoading = false,
  includeHeaders = true,
} = defineProps<{ table: Table<T>; isLoading: boolean; includeHeaders: boolean }>()
</script>

<template>
  <table
    v-loading="isLoading"
    class="bg-inherit min-w-full border-collapse table-auto divide-y divide-gray-200"
  >
    <thead v-if="includeHeaders">
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          :colspan="header.colSpan"
          :class="
            `text-start p-3 ` + `${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`
          "
          @click="header.column.getToggleSortingHandler()?.($event)"
        >
          <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td
          v-for="cell in row.getVisibleCells()"
          :key="cell.id"
          :class="`font-normal p-3 ` + `${row.getIsSelected() ? `bg-cool-gray` : ``}`"
        >
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="css" scoped>
table {
  --table-bg: #f1f1f1;
  --table-header-bg: #ebebeb;
}
</style>
