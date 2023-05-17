<script lang="ts" setup>
import { PropType } from 'vue';
import BoxContainer from './box-container.vue';
import { PromiseLink } from '@/models/promise';
import ExternalLink from '@/components/external-link.vue';

defineProps({
  link: {
    type: Object as PropType<PromiseLink>,
    default: () => ({
      name: '',
      url: '',
    }),
  },
});
</script>

<template>
  <div class="flex flex-col items-center">
    <BoxContainer class="border-black border wv-font-anuphan mb-3">
      <ExternalLink
        :url="link.url"
        class="wv-font-anuphan wv-font-bold wv-u4 text-ultramarine underline"
      >
        {{ link.name }}
      </ExternalLink>
    </BoxContainer>
  </div>
</template>
