<script setup lang="ts">
import { useVueTable, createColumnHelper, getCoreRowModel } from '@tanstack/vue-table'
import { watch, toRaw } from 'vue'
import {
  type OptionCreateForm,
  type OptionValueCreateForm,
  type ProductVariantCreateForm,
} from '@/lib/types'
import { TrashIcon } from '@heroicons/vue/24/outline'
import TableComponent from './TableComponent.vue'
import { cartesianProduct } from '@/lib/utils'

const options = defineModel<OptionCreateForm[]>('options', { required: true })
const variants = defineModel<ProductVariantCreateForm[]>('variants', { required: true })

const columnHelper = createColumnHelper<ProductVariantCreateForm>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor((row) => row.optionValues.map((value) => value.name).join(' / '), {
    header: 'Title',
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    sortingFn: 'alphanumeric',
  }),
  columnHelper.accessor('inventoryQuantity', {
    header: 'Inventory',
    sortingFn: 'alphanumeric',
  }),
]

const variantsTable = useVueTable({
  columns,
  data: variants,
  getCoreRowModel: getCoreRowModel(),
})

const addOption = () => {
  const optionId = `temp_${crypto.randomUUID()}`
  options.value.push({
    id: optionId,
    name: '',
    values: [],
  })
}

const deleteOption = (index: number) => {
  options.value.splice(index, 1)
  reorderOptions()
}

const reorderOptions = () => {
  options.value = options.value.map((option) => ({
    ...option,
  }))
}

const addOptionValue = (optionIndex: number) => {
  const option = options.value[optionIndex]
  if (!option) return
  if (!option.values) {
    option.values = []
  }
  option.values.push({
    id: `temp_${crypto.randomUUID()}`,
    name: '',
    optionId: option.id,
  })
}

const deleteOptionValue = (optionIndex: number, valueIndex: number) => {
  const option = options.value[optionIndex]
  if (!option) return
  option.values.splice(valueIndex, 1)
}

const isVariantMatch = (
  newSelections: OptionValueCreateForm[],
  oldVariantOptions: OptionValueCreateForm[],
) => {
  if (newSelections.length !== oldVariantOptions.length) return false

  const newOptionIds = newSelections.map((v) => v.optionId)
  const oldOptionIds = oldVariantOptions.map((v) => v.optionId)

  const sharedOptionIds = newOptionIds.filter((id) => oldOptionIds.includes(id))

  if (sharedOptionIds.length === 0) return false

  return sharedOptionIds.every((optId) => {
    const newVal = newSelections.find((v) => v.optionId === optId)
    const oldVal = oldVariantOptions.find((v) => v.optionId === optId)
    return newVal?.id === oldVal?.id
  })
}

const generateCartesianVariants = (options: OptionCreateForm[]) => {
  const activeOptions = options.filter((o) => o.values.length)

  if (!activeOptions.length) return []

  const combinations = cartesianProduct(activeOptions.map((o) => o.values))

  return combinations.map((comboValues) => {
    return {
      id: `variant_${crypto.randomUUID()}`,
      price: 0,
      sku: null,
      inventoryQuantity: 0,
      optionValues: comboValues,
    }
  })
}

const reconcileVariants = (
  options: OptionCreateForm[],
  currentVariants: ProductVariantCreateForm[],
) => {
  const variantSkeletons = generateCartesianVariants(options)
  const claimedVariantIds = new Set<string>()

  return variantSkeletons.map((skeleton) => {
    const ancestor = currentVariants.find((oldVar) => {
      const isMatch = isVariantMatch(skeleton.optionValues, oldVar.optionValues)
      const isAvailable = oldVar.id ? !claimedVariantIds.has(oldVar.id) : true
      return isMatch && isAvailable
    })

    if (ancestor) {
      if (ancestor.id) claimedVariantIds.add(ancestor.id)

      return {
        ...skeleton,
        id: ancestor.id,
        price: ancestor.price,
        sku: ancestor.sku,
        inventoryQuantity: ancestor.inventoryQuantity,
      }
    }

    let bestPartialMatch: ProductVariantCreateForm | null = null
    let maxSharedCount = -1

    for (const oldVar of currentVariants) {
      let sharedCount = 0
      for (const newOption of skeleton.optionValues) {
        const matchingOldOpt = oldVar.optionValues.find((o) => o.optionId === newOption.optionId)
        if (matchingOldOpt && matchingOldOpt.id === newOption.id) {
          sharedCount++
        }
      }

      if (sharedCount > maxSharedCount && sharedCount > 0) {
        maxSharedCount = sharedCount
        bestPartialMatch = oldVar
      }
    }

    if (bestPartialMatch) {
      return {
        ...skeleton,
        price: bestPartialMatch.price,
        sku: null,
        inventoryQuantity: 0,
      }
    }

    return skeleton
  })
}

watch(
  options,
  (newOptions) => {
    variants.value = reconcileVariants(toRaw(newOptions), toRaw(variants.value))
  },
  { deep: true },
)
</script>

<template>
  <form
    v-for="(option, optionIndex) in options"
    :key="option.id"
    class="border-b border-gray-200 p-3"
  >
    <label :for="`option-${optionIndex}-name`" class="font-semibold">Option name</label>
    <div class="flex gap-2 my-1">
      <input
        type="text"
        :id="`option-${optionIndex}-name`"
        v-model="option.name"
        placeholder="e.g., Size, Color, Material"
        required
        class="border border-gray-300 rounded p-2 w-full my-1"
      />
      <button type="button" @click="deleteOption(optionIndex)" class="p-2 hover:bg-red-100 rounded">
        <TrashIcon class="size-4" />
      </button>
    </div>

    <!-- Option Values -->
    <fieldset>
      <legend class="font-semibold">Option values</legend>
      <div
        v-for="(optionValue, valueIndex) in option.values"
        :key="optionValue.id"
        id="option-values"
        class="flex gap-2 my-1"
      >
        <input
          type="text"
          :id="`option-${option.name}-value-${optionValue.name}`"
          v-model="optionValue.name"
          placeholder="e.g., Small, Red, Cotton"
          required
          class="border border-gray-300 rounded p-2 w-full my-1"
        />
        <button
          type="button"
          :disabled="option.values.length === 1"
          @click="deleteOptionValue(optionIndex, valueIndex)"
          class="p-2 hover:bg-red-100 rounded"
        >
          <TrashIcon class="size-4" />
        </button>
      </div>

      <!-- Add option value button -->
      <div class="text-center">
        <button
          v-if="option.values.length < 10"
          type="button"
          @click="addOptionValue(optionIndex)"
          class="text-sm text-blue-600 hover:text-blue-800 font-medium my-3"
        >
          <p v-if="option.values.length < 1">+ Add value</p>
          <p v-else>+ Add another value</p>
        </button>
      </div>
    </fieldset>

    <button
      type="submit"
      @click.prevent=""
      class="p-2 shadow hover:bg-gray-300/50 rounded border border-gray-300 my-2"
    >
      Done
    </button>
  </form>

  <!-- Add option button -->
  <div class="text-center">
    <button
      v-if="options.length < 3"
      type="button"
      @click="addOption"
      class="text-blue-600 hover:text-blue-800 font-medium p-5"
    >
      <p v-if="options.length < 1">+ Add options like size or color</p>
      <p v-else>+ Add another option</p>
    </button>
  </div>

  <!-- Variants table -->
  <TableComponent v-if="variants.length > 0" :table="variantsTable" :is-loading="false" />
</template>
