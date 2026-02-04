<script setup lang="ts">
import { ref, watch } from 'vue'
import { currencyInfo } from '@/lib/currencyInfo'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { ArrowLeftIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import { useQuery } from '@tanstack/vue-query'
import { fetchCollections, fetchProduct } from '@/api/queries'
import StatusLabel from '@/components/StatusLabel.vue'
import { type CollectionPreview, type Product, type ProductOption } from '@/lib/types'
import ProductOptionPanel from '@/components/ProductOptionPanel.vue'
import TitleAndDescription from '@/components/TitleAndDescription.vue'

const props = defineProps<{
  id: string
}>()

const { symbol } = currencyInfo

const productQuery = useQuery({
  queryKey: ['product', () => props.id],
  queryFn: () => fetchProduct(props.id),
})

const collectionsQuery = useQuery({
  queryKey: ['collections'],
  queryFn: fetchCollections,
})

const title = ref<string>('')
const description = ref<string>('')
const collections = ref<CollectionPreview[]>([])
const selectedCollections = ref<CollectionPreview[]>([])
const productStatus = ref<boolean>(false)
const optionsStatus = ref<boolean>(false)
const options = ref<ProductOption[]>([])

watch(
  productQuery.isSuccess,
  (isSuccess) => {
    if (isSuccess && productQuery.data.value) {
      const product: Product = JSON.parse(JSON.stringify(productQuery.data.value))

      title.value = product.name
      description.value = product.description
      selectedCollections.value = product.collections
      productStatus.value = product.status
      optionsStatus.value = product.options.length > 0
      options.value = product.options.sort((prev, curr) => prev.position - curr.position)
    }
  },
  { immediate: true },
)

watch(
  collectionsQuery.isSuccess,
  (isSuccess) => {
    if (isSuccess && collectionsQuery.data.value) {
      collections.value = JSON.parse(JSON.stringify(collectionsQuery.data.value))
    }
  },
  { immediate: true },
)

const handleSubmit = () => {}
</script>

<template>
  <div v-if="productQuery.isPending.value">Loading...</div>
  <div v-else-if="productQuery.isError.value">An error has occured: {{ productQuery.error }}</div>

  <!-- Heading -->
  <template v-else-if="productQuery.data.value">
    <div class="max-w-4xl mx-auto mb-5 grid grid-cols-3 gap-5">
      <div class="flex flex-col items-center gap-5 col-span-2">
        <div class="flex items-center w-full gap-3">
          <RouterLink
            :to="{ name: 'products' }"
            class="p-1 hover:bg-current/20 rounded border border-gray-400"
          >
            <ArrowLeftIcon class="size-5" />
          </RouterLink>
          <h1 class="font-bold text-xl truncate">{{ title || 'Title' }}</h1>
          <StatusLabel :status="productStatus" />
        </div>

        <form @submit.prevent="handleSubmit" class="w-full text-sm flex flex-col gap-5">
          <!-- Title and Description -->
          <TitleAndDescription v-model:title="title" v-model:description="description" />

          <!-- Show Default Variant pricing and inventory if product has no options -->
          <template v-if="!optionsStatus">
            <section class="bg-background rounded shadow p-3">
              <h2 class="font-semibold mb-4">Pricing</h2>
              <label for="price">Price ({{ symbol }})</label>
              <input
                id="price"
                name="price"
                placeholder="0.00"
                type="number"
                class="w-full border border-gray-300 rounded p-2 my-1"
              />
            </section>
            <section class="bg-background rounded shadow-lg p-3">
              <h2 class="font-semibold mb-4">Inventory</h2>
              <div class="flex justify-center gap-2">
                <div class="w-full">
                  <label for="sku">SKU (Stock Keeping Unit)</label>
                  <input
                    id="sku"
                    name="sku"
                    type="text"
                    class="border border-gray-300 rounded p-2 w-full my-1"
                  />
                </div>
                <div class="w-full">
                  <label for="quantity">Quantity</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    defaultValue="0"
                    class="border border-gray-300 rounded p-2 w-full my-1"
                  />
                </div>
              </div>
            </section>
          </template>

          <!-- Product organization/collections -->
          <section class="bg-background rounded shadow-lg p-3 min-w-0">
            <h2 class="font-semibold mb-4">Product organization</h2>
            <div v-if="collectionsQuery.isPending.value">Loading...</div>
            <div v-else-if="collectionsQuery.isError.value">
              An error has occured: {{ collectionsQuery.error.value }}
            </div>
            <Listbox
              v-else-if="collectionsQuery.data.value"
              v-model="selectedCollections"
              name="selected-collections"
              multiple
            >
              <ListboxLabel>Collections</ListboxLabel>
              <ListboxButton
                class="relative border border-gray-300 rounded p-2 w-full flex items-center justify-between my-1"
              >
                <div v-if="selectedCollections.length" class="flex gap-1 flex-wrap">
                  <div
                    v-for="collection in selectedCollections"
                    :key="collection.id"
                    class="rounded-2xl border border-blue-900 bg-blue-100 max-w-xs p-1"
                  >
                    <p class="truncate">{{ collection.name }}</p>
                  </div>
                </div>
                <p v-else>Select collections</p>
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
                    <template v-if="collections.length">
                      <ListboxOption
                        v-for="collection in collections"
                        :key="collection.id"
                        :value="
                          selectedCollections.find((c) => collection.id === c.id) ?? collection
                        "
                        v-slot="{ active, selected }"
                        as="template"
                      >
                        <li
                          :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-2 cursor-default']"
                        >
                          <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                            <CheckIcon class="size-5" aria-hidden="true" />
                          </span>
                          <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                            {{ collection.name }}
                          </p>
                        </li>
                      </ListboxOption>
                    </template>
                    <ListboxOption v-else disabled class="p-2 opacity-70 cursor-default">
                      Create collections
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </section>

          <!-- Options section -->
          <section class="bg-background rounded shadow-lg">
            <div class="p-4 border-b border-gray-200">
              <h2 class="font-semibold mb-4">Options</h2>
              <div class="flex gap-2">
                <input type="checkbox" id="options" name="optionsStatus" v-model="optionsStatus" />
                <label for="options">This product has options, like size or color</label>
              </div>
            </div>
            <ProductOptionPanel v-if="optionsStatus" v-model="options" />
          </section>
        </form>
      </div>
      <div>
        <!-- Save changes or discard buttons -->
        <div class="mb-3.5">
          <button type="button" class="bg-gray-300 rounded p-2 hover:bg-gray-300/70">
            Discard
          </button>
          <button type="submit" class="bg-blue-300 rounded p-2 ml-2 hover:bg-blue-300/70">
            Save
          </button>
        </div>
        <!-- Product status -->
        <section class="bg-background rounded shadow-lg p-3">
          <Listbox v-model="productStatus" name="product-status">
            <ListboxLabel class="font-semibold">Product status</ListboxLabel>
            <ListboxButton
              class="relative border border-gray-300 rounded p-2 w-full flex items-center justify-between my-2"
            >
              <p>{{ productStatus ? 'Active' : 'Draft' }}</p>
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
                  <ListboxOption :value="true" v-slot="{ active, selected }" as="template">
                    <li :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-2 cursor-default']">
                      <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                        <CheckIcon class="size-5" aria-hidden="true" />
                      </span>
                      <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                        Active
                      </p>
                    </li>
                  </ListboxOption>
                  <ListboxOption :value="false" v-slot="{ active, selected }" as="template">
                    <li :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-2 cursor-default']">
                      <span v-show="selected" class="absolute left-0 pl-0.5 text-blue-600">
                        <CheckIcon class="size-5" aria-hidden="true" />
                      </span>
                      <p :class="[selected ? 'font-medium' : 'font-normal', 'pl-5 truncate']">
                        Draft
                      </p>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </section>
      </div>
    </div>
  </template>
</template>
