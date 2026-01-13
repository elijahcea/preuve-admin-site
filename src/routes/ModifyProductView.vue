<script setup lang="ts">
const props = defineProps({
    id: String
});
</script>

<template>
    <h1>Product Id is {{ props.id }}</h1>
</template>