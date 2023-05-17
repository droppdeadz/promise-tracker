<script lang="ts" setup>
defineProps({
  url: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <a :href="url" target="_blank" rel="noopener noreferrer">
    <slot />
  </a>
</template>
