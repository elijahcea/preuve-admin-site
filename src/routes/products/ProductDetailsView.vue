<script setup lang="tsx">
import { computed, ref } from 'vue'
import { currencyInfo } from '@/lib/currencyInfo'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchCollections, fetchProduct } from '@/api/queries'
import StatusLabel from '@/components/StatusLabel.vue'
import {
  type ProductVariant,
  type ProductOption,
  type ProductUpdateDTO,
  type OptionUpdateDTO,
  type ProductVariantUpdateDTO,
  type OptionCreateDTO,
  type ProductVariantCreateDTO,
} from '@/lib/types'
import {
  createOption,
  createVariant,
  updateOption,
  updateProduct,
  updateVariant,
} from '@/api/mutations'
import { ElTag } from 'element-plus'
import { createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import TableComponent from '@/components/TableComponent.vue'
import TagCell from '@/components/cells/TagCell.vue'
import PriceCell from '@/components/cells/PriceCell.vue'
import ItemActions from '@/components/ItemActions.vue'
import EditVariantDialog from '@/components/dialogs/EditVariantDialog.vue'
import EditProductDialog from '@/components/dialogs/EditProductDialog.vue'
import EditOptionDialog from '@/components/dialogs/EditOptionDialog.vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useAuth0 } from '@auth0/auth0-vue'
import EditStatusDialog from '@/components/dialogs/EditStatusDialog.vue'
import EditProductCollectionsDialog from '@/components/dialogs/EditProductCollectionsDialog.vue'
import CreateOptionDialog from '@/components/dialogs/CreateOptionDialog.vue'
import CreateVariantDialog from '@/components/dialogs/CreateVariantDialog.vue'

type ProductUpdatePayload = {
  action: 'update:product'
  data: ProductUpdateDTO
}
type OptionUpdatePayload = {
  action: 'update:option'
  data: OptionUpdateDTO & { optionId: string }
}

type VariantUpdatePayload = {
  action: 'update:variant'
  data: ProductVariantUpdateDTO & { variantId: string }
}

type OptionCreatePayload = {
  action: 'create:option'
  data: OptionCreateDTO
}

type VariantCreatePayload = {
  action: 'create:variant'
  data: ProductVariantCreateDTO
}

const props = defineProps<{
  id: string
}>()

const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } = useAuth0()

const isLoading = ref(false)
const activeEditOptionId = ref()
const activeEditVariantId = ref()
const isEditProductOpen = ref(false)
const isEditStatusOpen = ref(false)
const isEditCollectionsOpen = ref(false)
const isEditOptionOpen = ref(false)
const isEditVariantOpen = ref(false)
const isCreateOptionOpen = ref(false)
const isCreateVariantOpen = ref(false)

const productStatus = computed(() => productQuery.data.value?.product.status ?? false)
const title = computed(() => productQuery.data.value?.product.title ?? '')
const description = computed(() => productQuery.data.value?.product.description ?? '')
const options = computed(() => productQuery.data.value?.product.options ?? [])
const variants = computed(() => productQuery.data.value?.product.variants ?? [])
const collections = computed(() => collectionsQuery.data.value?.collections ?? [])
const selectedCollections = computed(() => productQuery.data.value?.product.collections ?? [])
const activeEditOption = computed(() =>
  options.value.find((o) => o.id === activeEditOptionId.value),
)
const activeEditVariant = computed(() =>
  variants.value.find((v) => v.id === activeEditVariantId.value),
)

const optionColumnHelper = createColumnHelper<ProductOption>()
const variantColumnHelper = createColumnHelper<ProductVariant>()

const queryClient = useQueryClient()

const productQuery = useQuery({
  queryKey: ['products', () => props.id],
  queryFn: () => fetchProduct(props.id),
})

const collectionsQuery = useQuery({
  queryKey: ['collections'],
  queryFn: fetchCollections,
})

const updateProductMutation = useMutation({
  mutationFn: ({ token, product }: { token: string; product: ProductUpdateDTO }) =>
    updateProduct(token, props.id, product),
})

const updateOptionMutation = useMutation({
  mutationFn: ({
    token,
    optionId,
    option,
  }: {
    token: string
    optionId: string
    option: OptionUpdateDTO
  }) => updateOption(token, props.id, optionId, option),
})

const updateVariantMutation = useMutation({
  mutationFn: ({
    token,
    variantId,
    variant,
  }: {
    token: string
    variantId: string
    variant: ProductVariantUpdateDTO
  }) => updateVariant(token, props.id, variantId, variant),
})

const createOptionMutation = useMutation({
  mutationFn: ({ token, option }: { token: string; option: OptionCreateDTO }) =>
    createOption(token, props.id, option),
})

const createVariantMutation = useMutation({
  mutationFn: ({ token, variant }: { token: string; variant: ProductVariantCreateDTO }) =>
    createVariant(token, props.id, variant),
})

const optionColumns = [
  optionColumnHelper.accessor('name', {
    header: 'Name',
  }),
  optionColumnHelper.accessor('values', {
    header: 'Values',
    cell: (props) => (
      <TagCell
        tagItems={props.getValue().map((v) => {
          return {
            name: v.name,
            key: v.id,
          }
        })}
      />
    ),
  }),
  optionColumnHelper.display({
    id: 'actions',
    cell: (props) => (
      <div class="text-end">
        <ItemActions
          itemId={props.row.id}
          onEditItem={() => {
            activeEditOptionId.value = props.row.id
            isEditOptionOpen.value = true
          }}
        />
      </div>
    ),
  }),
]

const variantColumns = [
  variantColumnHelper.accessor((row) => row.selectedValues.map((value) => value.name).join(' / '), {
    header: 'Title',
  }),
  variantColumnHelper.accessor('sku', {
    header: 'SKU',
  }),
  variantColumnHelper.accessor('price', {
    header: 'Price',
    sortingFn: 'alphanumeric',
    cell: (props) => (
      <PriceCell
        price={props.cell.getValue()}
        locale={currencyInfo.locale}
        currencySymbol={currencyInfo.symbol}
      />
    ),
  }),
  variantColumnHelper.accessor('inventoryQuantity', {
    header: 'Inventory',
    sortingFn: 'alphanumeric',
  }),
  variantColumnHelper.display({
    id: 'actions',
    cell: (props) => (
      <div class="text-end">
        <ItemActions
          itemId={props.row.id}
          onEditItem={() => {
            activeEditVariantId.value = props.row.id
            isEditVariantOpen.value = true
          }}
        />
      </div>
    ),
  }),
]

const optionTable = useVueTable({
  columns: optionColumns,
  data: options,
  enableSorting: false,
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
})

const variantsTable = useVueTable({
  columns: variantColumns,
  data: variants,
  getRowId: (row) => row.id,
  getCoreRowModel: getCoreRowModel(),
})

const revalidateProduct = async () => {
  try {
    await queryClient.invalidateQueries({ queryKey: ['products', () => props.id] })
  } catch (e) {
    ElNotification({
      title: 'Error refetching product',
      message: `${e}`,
      type: 'error',
      position: 'bottom-right',
    })
  }
}

const handleSubmit = async (
  payload:
    | ProductUpdatePayload
    | OptionUpdatePayload
    | VariantUpdatePayload
    | OptionCreatePayload
    | VariantCreatePayload,
) => {
  console.log(payload)
  if (isAuthenticated.value) {
    try {
      isLoading.value = true

      const token = await getAccessTokenSilently()

      switch (payload.action) {
        case 'update:product': {
          await updateProductMutation.mutate({ token, product: payload.data })
          break
        }
        case 'update:option': {
          await updateOptionMutation.mutate({
            token,
            optionId: payload.data.optionId,
            option: { name: payload.data.name, values: payload.data.values },
          })
          break
        }
        case 'update:variant': {
          await updateVariantMutation.mutate({
            token,
            variantId: payload.data.variantId,
            variant: {
              sku: payload.data.sku,
              price: payload.data.price,
              inventoryQuantity: payload.data.inventoryQuantity,
              selectedValues: payload.data.selectedValues,
            },
          })
          break
        }
        case 'create:option': {
          await createOptionMutation.mutate({
            token,
            option: payload.data,
          })
          break
        }
        case 'create:variant': {
          await createVariantMutation.mutate({
            token,
            variant: payload.data,
          })
          break
        }
        default:
          throw new Error('Please specify valid product action')
      }

      await revalidateProduct()

      isLoading.value = false
    } catch (e) {
      console.log(e)
      ElNotification({
        title: 'Error saving product',
        message: `${e}`,
        type: 'error',
        position: 'bottom-right',
      })
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
  <div v-if="productQuery.isPending.value">Loading...</div>
  <div v-else-if="productQuery.isError.value">
    An error has occured: {{ productQuery.error.value }}
  </div>

  <!-- Heading -->
  <template v-else-if="productQuery.data.value">
    <div
      v-loading="productQuery.isPending.value || isLoading"
      class="max-w-4xl mx-auto mb-5 grid grid-cols-3 gap-5 grid-container"
    >
      <div class="flex items-center w-full gap-3">
        <RouterLink
          :to="{ name: 'products' }"
          class="p-1 hover:bg-current/20 rounded border border-gray-400"
        >
          <ArrowLeftIcon class="size-5" />
        </RouterLink>
        <h1 class="font-bold text-xl truncate">{{ title }}</h1>
        <StatusLabel :status="productStatus" />
      </div>

      <div class="flex flex-col gap-3 col-start-3 row-start-2">
        <!-- Product status -->
        <section class="w-full bg-light outline outline-gray-200 rounded-xl shadow">
          <div class="flex items-center justify-between p-3 border-b border-gray-200">
            <h2 class="font-semibold">Product status</h2>
            <ItemActions
              :itemId="productQuery.data.value.product.id"
              @edit-item="isEditStatusOpen = true"
            />
          </div>
          <div class="p-3">
            <el-tag>{{ productStatus ? 'Active' : 'Draft' }}</el-tag>
          </div>

          <EditStatusDialog
            :is-open="isEditStatusOpen"
            :status="productQuery.data.value.product.status"
            @save-edit="(payload) => handleSubmit({ action: 'update:productStatus', ...payload })"
            @cancel-edit="isEditStatusOpen = false"
          />
        </section>

        <!-- Product organization -->
        <div v-if="collectionsQuery.isPending.value">Loading...</div>
        <div v-else-if="collectionsQuery.isError.value">
          An error has occured fetching collections: {{ collectionsQuery.error.value }}
        </div>

        <section
          v-else-if="collectionsQuery.data.value"
          class="bg-light rounded-xl shadow-lg divide-y divide-gray-200 min-w-0 col-start-3"
        >
          <div class="flex items-center justify-between p-3">
            <h2 class="font-semibold">Product organization</h2>
          </div>

          <!-- Collections -->
          <div class="p-3">
            <div class="mb-1 flex justify-between items-center">
              <p>Collections</p>
              <ItemActions
                :item-id="productQuery.data.value.product.id"
                @edit-item="isEditCollectionsOpen = true"
              />
            </div>

            <div v-if="selectedCollections.length" class="flex gap-1 flex-wrap">
              <el-tag v-for="collection in selectedCollections" :key="collection.id">
                <p class="truncate">{{ collection.title }}</p>
              </el-tag>
            </div>
            <p v-else>Select collections</p>

            <EditProductCollectionsDialog
              :is-open="isEditCollectionsOpen"
              :selected-collections="selectedCollections"
              :collections="collections"
              @save-edit="(payload) => handleSubmit({ action: 'update:product', ...payload })"
              @cancel-edit="isEditCollectionsOpen = false"
            />
          </div>
        </section>
      </div>

      <div class="flex flex-col items-center gap-5 col-span-2 row-start-2">
        <!-- Title and description section -->
        <section class="w-full bg-light rounded-xl shadow-lg outline outline-gray-200">
          <div class="flex items-center justify-between p-3 border-b border-b-gray-200">
            <h2 class="font-semibold">Product info</h2>
            <div class="text-end">
              <ItemActions
                :itemId="productQuery.data.value.product.id"
                @edit-item="isEditProductOpen = true"
              />
            </div>
          </div>
          <div class="p-3">
            <p>Title</p>
            <p id="title" class="border border-gray-300 rounded p-1 w-full mt-1">
              {{ title }}
            </p>
          </div>
          <div class="p-3">
            <p>Description</p>
            <p id="description" class="resize-none border border-gray-300 rounded p-1 w-full mt-1">
              {{ description }}
            </p>
          </div>

          <EditProductDialog
            :is-open="isEditProductOpen"
            :product-id="productQuery.data.value.product.id"
            :title="title"
            :description="description"
            @save-edit="(payload) => handleSubmit({ action: 'update:product', ...payload })"
            @cancel-edit="isEditProductOpen = false"
          />
        </section>

        <!-- Options section -->
        <section class="w-full bg-light rounded-xl shadow-lg outline outline-gray-200">
          <div class="flex items-center justify-between p-3 border-b border-b-gray-200">
            <h2 class="font-semibold">Options</h2>
            <button
              type="button"
              class="bg-light outline outline-gray-200 rounded-md py-1 px-2 hover:bg-cool-gray"
              @click.prevent="isCreateOptionOpen = true"
            >
              Create
            </button>
          </div>

          <div>
            <TableComponent
              v-if="options.length"
              :table="optionTable"
              :is-loading="false"
              :include-headers="false"
            />

            <CreateOptionDialog
              :is-open="isCreateOptionOpen"
              @save="(payload) => handleSubmit({ action: 'create:option', ...payload })"
              @cancel="isCreateOptionOpen = false"
            />

            <EditOptionDialog
              :is-open="isEditOptionOpen"
              :option-id="activeEditOption?.id"
              :name="activeEditOption?.name"
              :values="activeEditOption?.values"
              @save-edit="(payload) => handleSubmit({ action: 'update:option', ...payload })"
              @cancel-edit="isEditOptionOpen = false"
            />
          </div>
        </section>

        <section class="w-full bg-light outline outline-gray-200 rounded-xl shadow">
          <div class="flex items-center justify-between p-3 border-b border-b-gray-200">
            <h2 class="font-semibold">Variants</h2>
            <button
              type="button"
              class="bg-light outline outline-gray-200 rounded-md py-1 px-2 hover:bg-cool-gray"
              @click.prevent="isCreateVariantOpen = true"
            >
              Create
            </button>
          </div>

          <div>
            <TableComponent
              v-if="variants.length"
              :table="variantsTable"
              :is-loading="false"
              :include-headers="true"
            />

            <CreateVariantDialog
              :is-open="isCreateVariantOpen"
              :currency-symbol="currencyInfo.symbol"
              :options="options"
              @save="(payload) => handleSubmit({ action: 'create:variant', ...payload })"
              @cancel="isCreateVariantOpen = false"
            />

            <EditVariantDialog
              v-model:is-open="isEditVariantOpen"
              :currency-symbol="currencyInfo.symbol"
              :variant-id="activeEditVariant?.id"
              :options="options"
              :selected-values="activeEditVariant?.selectedValues"
              :inventory-quantity="activeEditVariant?.inventoryQuantity"
              :sku="activeEditVariant?.sku"
              :price="activeEditVariant?.price"
              @save-edit="(payload) => handleSubmit({ action: 'update:variant', ...payload })"
              @cancel-edit="isEditVariantOpen = false"
            />
          </div>
        </section>
      </div>
    </div>
  </template>
</template>

<style lang="css" scoped>
.grid-container {
  grid-template-rows: min-content auto;
}
</style>
