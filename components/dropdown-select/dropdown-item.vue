<script lang="ts" setup>
import { PropType } from 'vue';
import { Option } from './dropdown-select.vue';

const $emit = defineEmits(['click']);

const $config = useRuntimeConfig();

const props = defineProps({
  option: {
    type: Object as PropType<Option>,
    default: undefined,
  },
});

const click = () => {
  if (props.option?.isHeader) {
    return;
  }
  $emit('click', props.option?.value);
};
</script>

<template>
  <div v-if="option?.isHeader" class="dropdown-item wv-font-anuphan wv-u4">
    <div class="header-dash" />
    <span class="opacity-70">{{ option?.label }}</span>
    <div class="header-dash" />
  </div>
  <button
    v-else
    class="dropdown-item wv-font-anuphan wv-u4 hover:bg-gray hover:bg-opacity-20"
    @click="click"
  >
    <img
      v-if="option?.iconUrl"
      class="w-5 h-5 rounded-full border border-gray border-opacity-10"
      :src="`${$config.public.path.images}${option?.iconUrl}`"
    />
    <span>{{ option?.label }}</span>
  </button>
</template>

<style scoped>
.dropdown-item {
  @apply flex flex-row items-center py-2.5 px-2 space-x-2;
}
.header-dash {
  @apply flex-1 h-1 border-b border-gray border-dashed;
}
</style>
