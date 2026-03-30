import HomeDashboard from '@/views/HomeDashboard.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeDashboard },
    {
      path: '/products',
      children: [
        {
          path: '',
          name: 'products',
          component: () => import('@/views/products/ProductsList.vue'),
        },
        {
          path: 'new',
          name: 'newProduct',
          component: () => import('@/views/products/NewProduct.vue'),
        },
        {
          path: ':id',
          name: 'productDetails',
          component: () => import('@/views/products/ProductDetails.vue'),
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
          component: () => import('@/views/collections/CollectionsList.vue'),
        },
        {
          path: 'new',
          name: 'newCollection',
          component: () => import('@/views/collections/NewCollection.vue'),
        },
        {
          path: ':id',
          name: 'collectionDetails',
          component: () => import('@/views/collections/CollectionDetails.vue'),
          props: true,
        },
      ],
    },
  ],
})

export default router
