<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { IconBrandGithub } from '@tabler/icons-vue'
</script>

<template>
  <section class="max-w-prose leading-7 flex flex-col gap-4">
    <h1 class="text-xl font-bold">Home</h1>

    <p>
      Welcome to the Preuve Admin console! This console supports the
      <a
        href="https://github.com/elijahcea/preuve-ecommerce-site"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold underline underline-offset-2"
        >Preuve E-commerce storefront</a
      >
      and is used to manage the products on it's display. Here you can manage the store's products,
      variants, and collections. Authentication is required to complete write operations but feel
      free to play around in the console!
    </p>

    <p>
      Check out the repo for this project for details on how this was made. Please feel free to
      reach out to me if you'd like to collaborate on any fun projects or just connect! Visit
      <a
        href="https://www.elijahcea.com"
        target="_blank"
        rel="noopener noreferrer"
        class="font-semibold underline underline-offset-2"
        >elijahcea.com</a
      >
      for more information.
    </p>

    <div
      class="flex flex-col max-md:mx-auto max-md:w-30 md:flex-row items-stretch gap-4 text-xs pt-4"
    >
      <a
        href="https://github.com/elijahcea/preuve-admin-site"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-foreground text-background px-2 py-1 rounded-lg hover:bg-foreground/80 shadow inline-flex items-center justify-center gap-1"
      >
        <IconBrandGithub :size="24" />
        GitHub
      </a>
      <RouterLink
        :to="{ name: 'products' }"
        class="bg-foreground text-background px-2 py-1 rounded-lg hover:bg-foreground/80 shadow inline-flex items-center justify-center"
      >
        View Products
      </RouterLink>
      <RouterLink
        :to="{ name: 'collections' }"
        class="bg-foreground text-background px-2 py-1 rounded-lg hover:bg-foreground/80 shadow inline-flex items-center justify-center"
      >
        View Collections
      </RouterLink>
      <a
        href="https://www.preuvenewyork.com"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-foreground text-background px-2 py-1 rounded-lg hover:bg-foreground/80 shadow inline-flex items-center justify-center"
      >
        View Storefront
      </a>
    </div>
  </section>
</template>

<style scoped></style>
