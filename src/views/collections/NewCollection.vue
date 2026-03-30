<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { ArrowLeftIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import { fetchProducts } from '@/api/queries'
import TitleAndDescription from '@/components/TitleAndDescription.vue'
import type { CollectionCreateDTO, ProductPreview } from '@/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import { createCollection } from '@/api/mutations'
import router from '@/router'
import { useAuth0 } from '@auth0/auth0-vue'
import { ElMessageBox, ElNotification } from 'element-plus'

const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } = useAuth0()

const isLoading = ref(false)
const title = ref<string>('')
const description = ref<string>('')
const selectedProducts = ref<ProductPreview[]>([])

const products = computed(() => productsQuery.data.value?.products ?? [])

const queryClient = useQueryClient()

const productsQuery = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
})

const newCollectionMutation = useMutation({
  mutationFn: ({ token, newCollection }: { token: string; newCollection: CollectionCreateDTO }) =>
    createCollection(token, newCollection),
  onSuccess: (data) => {
    const { collection } = data
    router.push({ name: 'collectionDetails', params: { id: collection.id } })
  },
})

const revalidateCollections = async () => {
  try {
    await queryClient.invalidateQueries({ queryKey: ['collections'] }, { throwOnError: true })
  } catch (e) {
    ElNotification({
      title: 'Refresh page',
      message: `Error refetching collections: ${e}`,
      type: 'error',
      position: 'bottom-right',
    })
  }
}

const handleSubmit = async () => {
  console.log(selectedProducts.value)
  if (isAuthenticated.value) {
    try {
      isLoading.value = true

      const token = await getAccessTokenSilently()

      await newCollectionMutation.mutateAsync({
        token,
        newCollection: {
          title: title.value,
          description: description.value,
          productIds: selectedProducts.value.map((p) => p.id),
        },
      })

      await revalidateCollections()

      ElNotification({
        title: 'Success',
        message: `Successfully created collection: ${title.value}`,
        type: 'success',
        position: 'bottom-right',
      })

      isLoading.value = false
    } catch (e) {
      console.log(e)
      ElNotification({
        title: `Error creating collection: ${title.value}`,
        message: `${e}`,
        type: 'error',
        position: 'bottom-right',
      })
      isLoading.value = false
    }
  } else {
    ElMessageBox({
      title: 'Login Required',
      message: 'Authentication is required for this action. Please login to continue.',
      showCancelButton: true,
      confirmButtonText: 'Log In',
    })
      .then((action) => {
        if (action === 'confirm') {
          loginWithRedirect()
        }
      })
      .catch((reason) => console.log(reason))
  }
}
</script>

<template>
  <div v-loading="isLoading" class="max-w-3xl flex flex-col m-auto items-center gap-5">
    <div class="flex items-center justify-start w-full gap-3">
      <RouterLink
        :to="{ name: 'collections' }"
        class="p-1 hover:bg-current/20 rounded border border-gray-400"
      >
        <ArrowLeftIcon class="size-5" />
      </RouterLink>
      <h1 class="font-bold text-xl">Create collection</h1>
    </div>
    <form @submit.prevent="handleSubmit" class="w-full text-sm flex flex-col gap-5">
      <TitleAndDescription v-model:title="title" v-model:description="description" />

      <section class="bg-light rounded-xl shadow-lg p-3 min-w-0">
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
          <p class="my-1">Select products to be added to the collection.</p>
          <ListboxButton
            class="relative border border-gray-300 rounded p-2 w-full flex items-center justify-between my-1"
          >
            <div v-if="selectedProducts.length" class="flex gap-1 flex-wrap">
              <el-tag v-for="product in selectedProducts" :key="product.id">
                <p class="truncate">{{ product.title }}</p>
              </el-tag>
            </div>
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
                class="absolute z-50 w-full bg-light shadow-lg rounded border border-gray-300"
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
                        {{ product.title }}
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

      <div class="m-auto text-base">
        <RouterLink :to="{ name: 'collections' }">
          <button class="rounded-md bg-cool-gray py-1 px-2 hover:opacity-80">Cancel</button>
        </RouterLink>
        <button
          type="submit"
          class="rounded-md py-1 px-2 ml-2 bg-fill text-background hover:opacity-80"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>
