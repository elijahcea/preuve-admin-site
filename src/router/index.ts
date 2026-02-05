import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/routes/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    {
      path: '/products',
      children: [
        {
          path: '',
          name: 'products',
          component: () => import('@/routes/products/ProductsView.vue'),
        },
        {
          path: 'new',
          name: 'newProduct',
          component: () => import('@/routes/products/NewProductView.vue'),
        },
        {
          path: ':id',
          name: 'productDetails',
          component: () => import('@/routes/products/ProductDetailsView.vue'),
          props: true,
        },
      ],
    },
    {
      path: '/collections',
      children: [
        {
          path: '',
          name: 'collections',
          component: () => import('@/routes/collections/CollectionsView.vue'),
        },
        {
          path: 'new',
          name: 'newCollection',
          component: () => import('@/routes/collections/NewCollectionView.vue'),
        },
        {
          path: ':id',
          name: 'collectionDetails',
          component: () => import('@/routes/collections/CollectionDetailsView.vue'),
          props: true,
        },
      ],
    },
  ],
})

export default router
