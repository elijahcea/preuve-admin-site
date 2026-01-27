import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/routes/HomeView.vue'
import ProductsView from '@/routes/products/ProductsView.vue'
import CollectionsView from '@/routes/collections/CollectionsView.vue'
import OptionsView from '@/routes/OptionsView.vue'
import ProductDetailsView from '@/routes/products/ProductDetailsView.vue'
import CollectionDetailsView from '@/routes/collections/CollectionDetailsView.vue'
import NewProductView from '@/routes/products/NewProductView.vue'
import NewCollectionView from '@/routes/collections/NewCollectionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    {
      path: '/products',
      children: [
        { path: '', component: ProductsView },
        { path: 'new', name: 'newProduct', component: NewProductView },
        {
          path: ':id',
          name: 'productDetails',
          component: ProductDetailsView,
          props: true,
        },
      ],
    },
    {
      path: '/collections',
      children: [
        { path: '', component: CollectionsView },
        { path: 'new', name: 'newCollection', component: NewCollectionView },
        {
          path: ':id',
          name: 'collectionDetails',
          component: CollectionDetailsView,
          props: true,
        },
      ],
    },
    { path: '/options', component: OptionsView },
  ],
})

export default router
