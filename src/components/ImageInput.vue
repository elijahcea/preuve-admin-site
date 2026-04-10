<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ElMessage } from 'element-plus'
import { computed, useTemplateRef } from 'vue'

const { inputId } = defineProps<{ inputId: string }>()

const file = defineModel<File | undefined>('file', { required: true })

const fileInput = useTemplateRef('fileInput')

const filePreviewUrl = computed(() => (file.value ? URL.createObjectURL(file.value) : ''))
const filePreviewAlt = computed(() => file.value?.name ?? '')

const clearFile = () => {
  fileInput.value!.value = ''
  file.value = undefined
}

const handleFileChange = (e: Event) => {
  console.log('change', e)
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files?.length) {
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
  <div class="flex flex-col gap-4">
    <p class="text-xs">Image size cannot exceed 500KB. JPG/PNG images only</p>

    <input
      ref="fileInput"
      type="file"
      :id="inputId"
      :name="inputId"
      accept="image/jpeg, image/png, image/avif, image/webp, .jpg, .jpeg, .png, .webp, .avif"
      class="text-grey-500 file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:cursor-pointer hover:file:bg-blue-100/50 cursor-pointer"
      @change.prevent="handleFileChange"
    />

    <div v-if="file" class="flex flex-col gap-4">
      <div
        class="h-20 flex justify-between p-2 border border-foreground/10 border-dashed rounded-md"
      >
        <img :src="filePreviewUrl" :alt="filePreviewAlt" class="max-w-full h-auto" />

        <button type="button" @click.prevent="clearFile"><XMarkIcon class="size-4" /></button>
      </div>
    </div>
  </div>
</template>
