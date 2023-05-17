<script lang="ts" setup>
import { computed, PropType } from 'vue';
import ToggleItem from './toggle-item.vue';

enum Alignment {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export interface ListOption {
  label: string;
  value: string;
  colorClass?: string;
}

const $emit = defineEmits(['input']);

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<ListOption[]>,
    default: () => [],
  },
  align: {
    type: String,
    default: Alignment.Vertical, // eslint-disable-line vue/valid-define-props
  },
});

const alignmentClass = computed(() => {
  return props.align === Alignment.Vertical ? 'flex-col' : 'flex-row';
});
</script>

<template>
  <div class="flex gap-1" :class="alignmentClass">
    <ToggleItem
      v-for="option in options"
      :key="option.value"
      :selected="option.value === modelValue"
      :option="option"
      @selected="$emit('input', option.value)"
    />
  </div>
</template>
