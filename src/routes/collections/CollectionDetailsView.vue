<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { type Collection, type ProductPreview } from '@/lib/types'
import { ArrowLeftIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import { fetchCollection, fetchProducts } from '@/api/queries'
import { useQuery } from '@tanstack/vue-query'
import TitleAndDescription from '@/components/TitleAndDescription.vue'

const props = defineProps<{
  id: string
}>()

const collectionQuery = useQuery({
  queryKey: ['collections', () => props.id],
  queryFn: () => fetchCollection(props.id),
})

const productsQuery = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

const title = ref<string>('')
const description = ref<string>('')
const products = ref<ProductPreview[]>([])
const selectedProducts = ref<ProductPreview[]>([])

watch(
  collectionQuery.isSuccess,
  (isSuccess) => {
    if (isSuccess && collectionQuery.data.value) {
      const collection: Collection = JSON.parse(JSON.stringify(collectionQuery.data.value))

      title.value = collection.name
      description.value = collection.description
      selectedProducts.value = collection.products
    }
  },
  { immediate: true },
)

watch(
  productsQuery.isSuccess,
  (isSuccess) => {
    if (isSuccess && productsQuery.data.value) {
      products.value = JSON.parse(JSON.stringify(productsQuery.data.value))
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="collectionQuery.isPending.value">Loading...</div>
  <div v-else-if="collectionQuery.isError.value">
    Something went wrong: {{ collectionQuery.error }}
  </div>
  <div
    v-else-if="collectionQuery.data.value"
    class="max-w-2xl flex flex-col m-auto items-center gap-5"
  >
    <div class="flex items-center justify-start w-full gap-3">
      <RouterLink
        :to="{ name: 'collections' }"
        class="p-1 hover:bg-current/20 rounded border border-gray-400"
      >
        <ArrowLeftIcon class="size-5" />
      </RouterLink>
      <h1 class="font-bold text-xl truncate">{{ title || 'Title' }}</h1>
    </div>
    <form class="w-full text-sm flex flex-col gap-5">
      <!-- Title and Description -->
      <TitleAndDescription v-model:title="title" v-model:description="description" />

      <section class="bg-background rounded shadow-lg p-3 min-w-0">
        <div v-if="productsQuery.isPending.value">Loading...</div>
        <div v-else-if="productsQuery.isError.value">
          Something went wrong: {{ productsQuery.error.value }}
        </div>
        <Listbox
          v-else-if="productsQuery.data.value"
          v-model="selectedProducts"
          name="selected-products"
          multiple
        >
          <ListboxLabel class="font-semibold">Products</ListboxLabel>
          <ListboxButton
            class="relative border border-gray-300 rounded p-2 w-full flex items-center justify-between my-1"
          >
            <template v-if="selectedProducts.length">
              <div class="flex gap-1 flex-wrap">
                <div
                  v-for="product in selectedProducts"
                  :key="product.id"
                  class="rounded-2xl border border-blue-900 bg-blue-100 max-w-xs p-1"
                >
                  <p class="truncate">{{ product.name }}</p>
                </div>
              </div>
            </template>
            <p v-else>Select products</p>
            <span>
              <ChevronUpDownIcon class="size-5" aria-hidden="true" />
            </span>
          </ListboxButton>
          <div class="relative mt-1">
            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute z-50 w-full bg-background shadow-lg rounded border border-gray-300"
              >
                <template v-if="products.length">
                  <ListboxOption
                    v-for="product in products"
                    :key="product.id"
                    :value="selectedProducts.find((p) => product.id === p.id) ?? product"
                    v-slot="{ active, selected }"
                    as="template"
                  >
                    <li :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-2 cursor-default']">
                      <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                        <CheckIcon class="size-5" aria-hidden="true" />
                      </span>
                      <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                        {{ product.name }}
                      </p>
                    </li>
                  </ListboxOption>
                </template>
                <ListboxOption v-else disabled class="p-2 opacity-70 cursor-default">
                  Create products
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </section>
      <div class="m-auto">
        <button type="button" class="bg-gray-300 rounded p-2 hover:bg-gray-300/70">Discard</button>
        <button type="submit" class="bg-blue-300 rounded p-2 ml-2 hover:bg-blue-300/70">
          Save
        </button>
      </div>
    </form>
  </div>
</template>
