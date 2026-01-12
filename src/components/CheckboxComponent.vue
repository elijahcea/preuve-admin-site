<script setup lang="ts">

const { checked, intederminate = false, disabled = false, onChange } = defineProps<{
    checked: boolean;
    intederminate?: boolean; 
    disabled?: boolean;
    onChange: (payload: Event) => void;
}>()
</script>

<template>
    <input
        type="checkbox"
        :checked="checked"
        :indeterminate="intederminate"
        :disabled="disabled"
        @change="onChange"
    />
</template>