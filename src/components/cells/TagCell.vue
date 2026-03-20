<script setup lang="ts">
import { ElTag } from 'element-plus'

const { tagItems } = defineProps<{ tagItems: { name: string; key: string }[] }>()
</script>

<template>
  <div class="flex gap-1">
    <el-tag v-for="item in tagItems" :key="item.key">{{ item.name }}</el-tag>
  </div>
</template>
