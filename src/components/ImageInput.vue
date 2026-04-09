<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, useTemplateRef } from 'vue'

const file = defineModel<File | undefined>({ required: true })

const fileInput = useTemplateRef('fileInput')

const filePreviewUrl = computed(() => (file.value ? URL.createObjectURL(file.value) : ''))
const filePreviewAlt = computed(() => file.value?.name ?? '')

const clearFile = () => {
  fileInput.value!.value = ''
  file.value = undefined
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files) {
    if (files[0]!.size > 500000) {
      clearFile()
      ElMessage.error('Image size cannot exceed 500KB!')
      return
    }
    file.value = files[0]
  }
}
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    id="featured-image"
    name="featured-image"
    accept="image/jpeg, image/png, .jpg, .jpeg, .png"
    @change="handleFileChange"
  />
  <div v-if="file">
    <button type="button" @click.prevent="clearFile">Clear File</button>
    <img :src="filePreviewUrl" :alt="filePreviewAlt" />
  </div>
</template>
