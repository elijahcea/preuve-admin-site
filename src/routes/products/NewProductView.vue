<script setup lang="ts">
import { ref } from 'vue'
import { currencyInfo } from '@/lib/currencyInfo'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { type Collection } from '@/lib/types'
import { ArrowLeftIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'

const collections: Collection[] = []
const selectedCollections = ref<Collection[]>([])
const productStatus = ref<boolean>()

const { symbol } = currencyInfo
</script>

<template>
  <div class="max-w-2xl flex flex-col m-auto items-center gap-5">
    <div class="flex items-center justify-start w-full gap-3">
      <RouterLink to="/products" class="p-1 hover:bg-current/20 rounded border border-gray-400">
        <ArrowLeftIcon class="size-5" />
      </RouterLink>
      <h1 class="font-bold text-xl">Create product</h1>
      <div
        :class="[
          'rounded-2xl border p-1 text-xs',
          productStatus
            ? 'border-blue-300 bg-blue-300 text-blue-900'
            : 'border-gray-300 bg-gray-300 text-gray-900',
        ]"
      >
        {{ productStatus ? 'Active' : 'Draft' }}
      </div>
    </div>
    <form class="w-full text-sm flex flex-col gap-5">
      <fieldset class="bg-background rounded shadow-lg p-3">
        <div>
          <label for="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            class="border border-gray-300 rounded p-1 w-full my-1"
          />
        </div>
        <div>
          <label for="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter description"
            rows="5"
            class="resize-none border border-gray-300 rounded p-1 w-full my-1"
          ></textarea>
        </div>
      </fieldset>
      <fieldset class="bg-background rounded shadow p-3">
        <h2 class="font-semibold mb-4">Pricing</h2>
        <label for="price">Price ({{ symbol }})</label>
        <input
          id="price"
          name="price"
          placeholder="0.00"
          type="number"
          class="w-full border border-gray-300 rounded p-1 my-1"
        />
      </fieldset>
      <fieldset class="bg-background rounded shadow-lg p-3">
        <h2 class="font-semibold mb-4">Inventory</h2>
        <div class="flex justify-center gap-2">
          <div class="w-full">
            <label for="sku">SKU (Stock Keeping Unit)</label>
            <input
              id="sku"
              name="sku"
              type="text"
              class="border border-gray-300 rounded p-1 w-full my-1"
            />
          </div>
          <div class="w-full">
            <label for="quantity">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              defaultValue="0"
              class="border border-gray-300 rounded p-1 w-full my-1"
            />
          </div>
        </div>
      </fieldset>
      <fieldset class="bg-background rounded shadow-lg p-3 min-w-0">
        <h2 class="font-semibold mb-4">Product organization</h2>
        <Listbox v-model="selectedCollections" name="selected-collections" multiple>
          <ListboxLabel>Collections</ListboxLabel>
          <ListboxButton
            class="relative border border-gray-300 rounded p-2 w-full flex items-center justify-between my-1"
          >
            <template v-if="selectedCollections.length">
              <div class="flex gap-1 flex-wrap">
                <div
                  v-for="collection in selectedCollections"
                  :key="collection.id"
                  class="rounded-2xl border border-blue-900 bg-blue-100 max-w-xs p-1"
                >
                  <p class="truncate">{{ collection.name }}</p>
                </div>
              </div>
            </template>
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
                    :value="collection"
                    v-slot="{ active, selected }"
                    as="template"
                  >
                    <li :class="[active ? 'bg-blue-100 text-blue-900' : '', 'p-2 cursor-default']">
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
      </fieldset>
      <fieldset class="bg-background rounded shadow-lg p-3">
        <Listbox v-model="productStatus" name="product-status">
          <ListboxLabel class="font-semibold">Product status</ListboxLabel>
          <ListboxButton
            class="relative border border-gray-300 rounded p-2 w-full flex items-center justify-between my-1"
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
      </fieldset>
      <div class="m-auto">
        <button type="button" class="bg-gray-300 rounded p-2 hover:bg-gray-300/70">Discard</button>
        <button type="submit" class="bg-blue-300 rounded p-2 ml-2 hover:bg-blue-300/70">
          Save
        </button>
      </div>
    </form>
  </div>
</template>
