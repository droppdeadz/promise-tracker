<script lang="ts" setup>
import { computed, reactive, PropType } from 'vue';
import IconRight from './icon-right.vue';
import {
  Group,
  getGroupBy,
  getGroupTitle,
  getFilteredPromise,
  getComputedPromisePerPage,
  getPageLength,
  getPageNumberArray,
  getCurrentPagePromises,
  getPromisesLength,
} from './topic-utils';
import PromiseCard from '@/components/promise-card/promise-card.vue';
import Button from '@/components/button.vue';
import { TrackingPromise, PromiseTopic, PromiseStatus } from '@/models/promise';

const $config = useRuntimeConfig();

const $emit = defineEmits(['viewGroup']);

const props = defineProps({
  topic: {
    type: String as PropType<PromiseTopic>,
    default: '',
  },
  status: {
    type: String as PropType<PromiseStatus>,
    default: '',
  },
  promises: {
    type: Array as PropType<TrackingPromise[]>,
    default: () => [{}],
  },
  promisePerPage: {
    type: Number,
    default: 0,
  },
});

const state = reactive({
  currentPage: 1,
});

const groupBy = computed((): Group => {
  return getGroupBy(props.topic, props.status);
});
const groupTitle = computed((): string | undefined => {
  return getGroupTitle(groupBy.value.by, groupBy.value.where);
});
const filteredPromise = computed((): TrackingPromise[] => {
  return getFilteredPromise(
    props.promises,
    groupBy.value.by,
    groupBy.value.where
  );
});
const computedPromisePerPage = computed((): number => {
  return getComputedPromisePerPage(
    props.promisePerPage,
    filteredPromise.value.length
  );
});
const pageLength = computed((): number => {
  return getPageLength(
    filteredPromise.value.length,
    computedPromisePerPage.value
  );
});
const pageNumberArray = computed((): (string | number)[] => {
  return getPageNumberArray(pageLength.value, state.currentPage);
});
const currentPagePromises = computed((): TrackingPromise[] => {
  return getCurrentPagePromises(
    filteredPromise.value,
    state.currentPage,
    computedPromisePerPage.value
  );
});
const promisesLength = computed((): number => {
  return getPromisesLength(filteredPromise.value);
});

const viewAll = () => {
  state.currentPage = 1;
  $emit('viewGroup');
};
</script>

<template>
  <div v-if="promisesLength > 0" class="mb-8">
    <div
      :id="`group-${groupBy.where}-header`"
      class="group-header"
      :class="
        groupBy.by === 'topic' ? 'bg-ultramarine' : `bg-status-${groupBy.where}`
      "
    >
      <div class="flex items-center">
        <img
          class="w-8 my-2 ml-6 mr-2"
          :src="`${$config.public.path.images}/${groupBy.by}/${groupBy.where}.png`"
          :alt="groupBy.where"
        />
        <p class="wv-h10 wv-font-bold wv-font-kondolar pl-2">
          {{ groupTitle }}
        </p>
      </div>
      <p class="flex flex-shrink-0 wv-u4 wv-font-semibold wv-font-anuphan pr-4">
        {{ promisesLength }} คำสัญญา
      </p>
    </div>
    <PromiseCard
      v-for="promise in currentPagePromises"
      :key="`${groupBy.where}-group-promise-card-${promise.id}`"
      class="pb-2"
      :promise="promise"
    />
    <div
      v-if="promisesLength > 0 && promisePerPage > 0"
      class="flex justify-between items-center"
    >
      <div class="flex items-center">
        <button
          :id="`${groupBy.where}-left-navigation-button`"
          class="transform rotate-180 navigation-button mr-1"
          :class="state.currentPage > 1 ? 'border border-white' : ''"
          @click="state.currentPage > 1 ? (state.currentPage -= 1) : null"
        >
          <IconRight />
        </button>
        <div
          v-for="(pageNumber, index) in pageNumberArray"
          :id="`${groupBy.where}-page-${pageNumber}-key-${index}`"
          :key="`${groupBy.where}-page-${pageNumber}-key-${index}`"
          class="mr-1"
        >
          <button
            class="wv-font-anuphan wv-u5 wv-font-bold rounded-sm"
            :class="
              pageNumber !== '...'
                ? pageNumber === state.currentPage
                  ? 'bg-white text-black border border-white w-6 h-6'
                  : 'text-white border border-white w-6 h-6'
                : 'text-white w-3'
            "
            @click="
              pageNumber !== '...' ? (state.currentPage = pageNumber) : null
            "
          >
            {{ pageNumber }}
          </button>
        </div>
        <button
          :id="`${groupBy.where}-right-navigation-button`"
          class="navigation-button"
          :class="state.currentPage < pageLength ? 'border border-white' : ''"
          @click="
            state.currentPage < pageLength ? (state.currentPage += 1) : null
          "
        >
          <IconRight />
        </button>
      </div>
      <Button theme="secondary-white" @click="viewAll"
        >ดูประเด็นนี้ทั้งหมด</Button
      >
    </div>
  </div>
</template>

<style scoped>
.group-header {
  @apply flex items-center justify-between rounded-xl border border-white text-white overflow-hidden mb-6;
}
.navigation-button {
  @apply w-6 h-6 flex justify-center items-center rounded-sm;
}
</style>
