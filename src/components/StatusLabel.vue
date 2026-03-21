<script setup lang="ts">
import { ElTag } from 'element-plus'

const { status } = defineProps<{
  status: boolean
}>()
</script>

<template>
  <el-tag effect="dark" :type="status ? 'primary' : 'info'">
    {{ status ? 'Active' : 'Draft' }}
  </el-tag>
</template>
