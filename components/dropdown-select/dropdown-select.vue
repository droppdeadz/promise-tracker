<script lang="ts" setup>
import { computed, reactive, PropType } from 'vue';
import DropdownIcon from './dropdown-icon.vue';
import DropdownItem from './dropdown-item.vue';

export interface Option {
  isHeader?: boolean;
  label: string;
  value: string;
  iconUrl?: string;
}

const $config = useRuntimeConfig();

const $emit = defineEmits(['input']);

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  placeholderSelecting: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<Option[]>,
    default: () => [],
  },
});

const state = reactive({
  selecting: false,
});

const selectClasses = computed(() => {
  if (state.selecting) {
    return 'text-white bg-transparent';
  }
  return 'bg-white';
});

const selectedOption = computed(() =>
  props.options.find((o) => o.value === props.modelValue)
);

const toggleSelecting = () => (state.selecting = !state.selecting);
const select = (value: string) => {
  $emit('input', value);
  toggleSelecting();
};
</script>

<template>
  <div class="relative">
    <button
      id="select-box"
      class="flex w-full space-x-1 justify-between items-center py-2.5 px-2 rounded-sm wv-font-anuphan wv-font-semibold wv-u5 border-white border"
      :class="selectClasses"
      @click="toggleSelecting"
    >
      <div v-if="modelValue" class="flex items-center">
        <img
          v-if="options"
          class="w-5 h-5 rounded-full border border-gray border-opacity-10 mr-1"
          :src="`${$config.public.path.images}${selectedOption?.iconUrl}`"
        />
        <span v-if="options">{{ selectedOption?.label }}</span>
      </div>
      <span v-else-if="!state.selecting">{{ placeholder }}</span>
      <span v-else>{{ placeholderSelecting }}</span>
      <DropdownIcon
        :theme="state.selecting ? 'white' : 'black'"
        :class="state.selecting ? 'transform rotate-180' : null"
      />
    </button>
    <template v-if="state.selecting">
      <div class="hidden md:fixed inset-0" @click="state.selecting = false" />

      <div
        id="item-list"
        class="md:absolute inset-x-0 top-full z-10 md:max-h-64 overflow-y-scroll mt-1 bg-white rounded overflow-hidden"
      >
        <div class="flex flex-col bg-opacity-20">
          <DropdownItem
            :option="{ label: placeholder, value: '' }"
            @click="select($event)"
          />
          <DropdownItem
            v-for="option in options"
            :key="option.value"
            :option="option"
            @click="select($event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>
