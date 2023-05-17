<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { Filter, FilterType } from '@/models/filter';

const buttons = [
  { label: 'ดูตามสถานะ', type: FilterType.Status },
  { label: 'ดูตามพรรค', type: FilterType.Party },
  { label: 'ดูตามประเด็น', type: FilterType.Topic },
];

const $emit = defineEmits(['change']);

const props = defineProps({
  filters: {
    type: Array as PropType<Filter[]>,
    default: () => [],
  },
  activeTab: {
    type: String as PropType<FilterType>,
    default: null,
  },
});

const displayButtons = computed(() => {
  const displayButtons = buttons.filter(
    ({ type }) => !props.filters.find((filter) => filter.type === type)
  );

  if (
    displayButtons.length > 0 &&
    !displayButtons.some(({ type }) => type === props.activeTab)
  ) {
    onChange(displayButtons[0].type);
  }

  return displayButtons;
});

const onChange = (type: FilterType) => {
  $emit('change', type);
};
</script>

<template>
  <div class="flex flex-row space-x-1 bg-white md:bg-transparent">
    <button
      v-for="{ label, type } in displayButtons"
      :key="type"
      :class="`wv-u4 wv-font-semibold text-white w-1/3 px-3 py-2 rounded-t border border-white ${
        activeTab === type ? 'bg-ultramarine border-b-0' : 'bg-black'
      }`"
      @click="onChange(type)"
    >
      {{ label }}
    </button>
  </div>
</template>
