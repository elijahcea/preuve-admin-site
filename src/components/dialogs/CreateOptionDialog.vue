<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import type { OptionValueCreateInput } from '@/lib/types'
import { ElTag, ElInput, ElButton, ElMessage } from 'element-plus'
import type { InputInstance } from 'element-plus'

const { isOpen } = defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits(['save', 'cancel'])

const name = ref('')
const values = ref<OptionValueCreateInput[]>([])
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()
const inputValue = ref('')

const handleClose = (tagName: string) => {
  values.value.splice(
    values.value.findIndex((v) => v.name === tagName),
    1,
  )
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    const exisitingVal = values.value.find((v) => v.name === inputValue.value)
    if (exisitingVal) {
      ElMessage({
        message: 'Value already exists',
        type: 'error',
      })
    } else {
      values.value.push({ name: inputValue.value })
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

watch(
  () => isOpen,
  (val) => {
    if (val === true) {
      name.value = ''
      values.value = []
    }
  },
)
</script>

<template>
  <TransitionRoot :show="isOpen" as="template">
    <Dialog @close="emit('cancel')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25"></div>
      </TransitionChild>
      <form
        @submit.prevent="emit('save', { name, values })"
        class="fixed inset-0 flex min-h-full items-center justify-center text-xs md:text-sm"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="w-full max-w-md bg-background p-3 rounded-xl">
            <DialogTitle class="font-semibold mb-3">Create option</DialogTitle>

            <div class="flex flex-col justify-center gap-2">
              <div>
                <label for="name-create">Name</label>
                <input
                  id="name-create"
                  type="text"
                  class="border border-gray-300 rounded p-1 w-full mt-1"
                  v-model="name"
                  required
                />
              </div>

              <div>
                <p for="value-tags">Values</p>
                <div class="flex flex-wrap gap-1 border border-gray-300 rounded p-1 mt-1">
                  <el-tag
                    v-for="value in values"
                    :key="value.name"
                    closable
                    :disable-transitions="true"
                    @close="handleClose(value.name)"
                    >{{ value.name }}</el-tag
                  >
                  <el-input
                    v-if="inputVisible"
                    ref="InputRef"
                    v-model="inputValue"
                    size="small"
                    @keydown.enter.prevent="handleInputConfirm"
                    @blur="handleInputConfirm"
                  />
                  <el-button v-else size="small" @click="showInput" :disabled="values.length > 10">
                    + New value
                  </el-button>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-1 mt-3">
              <button
                type="button"
                class="bg-light outline outline-gray-200 font-medium rounded-md py-1 px-2 hover:bg-gray-200"
                @click="emit('cancel')"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="font-medium rounded-md ml-2 py-1 px-2 bg-fill text-background hover:opacity-80"
              >
                Done
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </form>
    </Dialog>
  </TransitionRoot>
</template>
