import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/routes/HomeView.vue";
import ProductsView from "@/routes/ProductsView.vue";
import CollectionsView from "@/routes/CollectionsView.vue";
import OptionsView from "@/routes/OptionsView.vue";
import ProductDetailsView from "@/routes/ProductDetailsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: HomeView },
    { path: "/products",
      children: [
        { path: "", component: ProductsView },
        { path: ":id", name: "productDetails" , component: ProductDetailsView, props: true }
      ]
    },
    { path: "/collections", component: CollectionsView },
    { path: "/options", component: OptionsView }
  ],
})

export default router
