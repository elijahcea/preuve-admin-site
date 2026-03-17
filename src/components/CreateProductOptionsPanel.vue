<script setup lang="ts">
import { watch, toRaw } from 'vue'
import {
  type OptionCreateForm,
  type OptionValueCreateForm,
  type ProductVariantCreateForm,
} from '@/lib/types'
import { PlusCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { cartesianProduct } from '@/lib/utils'

const options = defineModel<OptionCreateForm[]>('options', { required: true })
const variants = defineModel<ProductVariantCreateForm[]>('variants', { required: true })

const addOption = () => {
  const optionId = `temp_${crypto.randomUUID()}`
  options.value.push({
    id: optionId,
    name: '',
    values: [
      {
        id: `temp_${crypto.randomUUID()}`,
        name: '',
        optionId: optionId,
      },
    ],
  })
}

const deleteOption = (index: number) => {
  options.value.splice(index, 1)
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

  return newSelections.every((optionValue) => {
    const matchingValue = oldVariantOptions.find((ov) => ov.id === optionValue.id)
    return !!matchingValue
  })
}

const generateCartesianVariants = (options: OptionCreateForm[]) => {
  const activeOptions = options.filter((option) => option.values.some((value) => value.name.length))

  if (!activeOptions.length) return []

  for (const option of activeOptions) {
    option.values.filter((value) => value.name.length)
  }

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
      const isAvailable = !claimedVariantIds.has(oldVar.id)
      return isMatch && isAvailable
    })

    if (ancestor) {
      claimedVariantIds.add(ancestor.id)

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
      for (const newOptionValue of skeleton.optionValues) {
        const matchingValue = oldVar.optionValues.find((o) => o.id === newOptionValue.id)
        if (matchingValue && matchingValue.optionId === newOptionValue.optionId) {
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
    <label :for="`option-${optionIndex}-name`" class="font-semibold">Name</label>
    <div class="flex gap-2 my-1">
      <input
        type="text"
        :id="`option-${optionIndex}-name`"
        v-model="option.name"
        required
        class="border border-gray-300 rounded p-1 w-full my-1"
      />
      <button
        type="button"
        @click="deleteOption(optionIndex)"
        class="p-1 hover:bg-cool-gray rounded"
        aria-label="Delete option"
      >
        <XMarkIcon class="size-4" />
      </button>
    </div>

    <!-- Option Values -->
    <fieldset>
      <legend class="font-semibold">Values</legend>
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
          required
          class="border border-gray-300 rounded p-1 w-full my-1"
        />
        <button
          type="button"
          @click="deleteOptionValue(optionIndex, valueIndex)"
          class="p-1 hover:bg-cool-gray rounded"
          aria-label="Delete option value"
        >
          <XMarkIcon class="size-4" />
        </button>
      </div>

      <!-- Add option value button -->
      <div class="text-center">
        <button
          v-if="option.values.length < 10"
          type="button"
          @click="addOptionValue(optionIndex)"
          class="my-1"
        >
          <PlusCircleIcon class="size-5" />
        </button>
      </div>
    </fieldset>
  </form>

  <!-- Add option button -->
  <div class="text-center">
    <button
      v-if="options.length < 3"
      type="button"
      @click="addOption"
      class="font-bold rounded py-1 px-2 my-3 bg-fill text-background"
    >
      Add option
    </button>
  </div>
</template>
