<script lang="ts" setup>
import { reactive, PropType } from 'vue';
import SingleCard from './single-card.vue';
import ExpandedCard from './expanded-card.vue';
import { TrackingPromise } from '@/models/promise';

const props = defineProps({
  promise: {
    type: Object as PropType<TrackingPromise>,
    default: () => ({}),
  },
  openState: {
    type: Boolean,
    default: false,
  },
});

const state = reactive({
  readMoreState: props.openState,
});

const handleReadClick = (clickState: boolean) => {
  state.readMoreState = clickState;
};
</script>

<template>
  <div :id="`promise-card-${promise.id}`" class="w-full">
    <SingleCard
      :openState="openState"
      :promise="promise"
      @readmore="handleReadClick($event)"
    />
    <ExpandedCard :expanded="state.readMoreState" :promise="promise" />
  </div>
</template>
