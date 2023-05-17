<script lang="ts" setup>
import { computed } from 'vue';
import { PromiseStatus } from '@/models/promise';

const $config = useRuntimeConfig();

const props = defineProps({
  partyLogo: {
    type: String,
    default: '',
    required: false,
  },
  partyName: {
    type: String,
    default: '',
  },
  partyPromises: {
    type: Array,
    default: () => [],
  },
  buttonUrl: {
    type: String,
    default: '',
  },
});

const sumPartyPromises = computed(() => {
  const promiseStatus = props.partyPromises as Array<any>;
  const count = promiseStatus.map((a: any) => a.count);
  if (count.length > 0) {
    const sum = count.reduce((a: any, b: any) => a + b);
    return sum;
  } else {
    return 0;
  }
});

const promises = computed(() => {
  const promiseStatus = props.partyPromises as Array<any>;
  if (promiseStatus.length > 0) {
    const chart = promiseStatus.map((a: any) => {
      const status = a.status;
      const count = a.count;
      const countPercentage = (
        (a.count / sumPartyPromises.value) *
        100
      ).toFixed(2);
      return { status, count, countPercentage };
    });
    return chart;
  } else {
    const dummy = [{ status: PromiseStatus.NoData, countPercentage: '100' }];
    return dummy;
  }
});
</script>

<template>
  <div
    class="flex bg-white w-full px-4 py-3 rounded-sm flex-row gap-3 text-black"
  >
    <div>
      <div class="w-10 h-10 md:w-9 md:h-9">
        <img
          v-if="partyLogo"
          class="w-full h-full rounded-full shadow"
          :src="`${$config.public.path.images}/${partyLogo}`"
          :alt="partyName"
        />
        <img
          v-else
          class="w-full h-full rounded-full shadow"
          :src="`${$config.public.path.images}/party/dummy.jpg`"
          alt="Dummy Party Logo"
        />
      </div>
    </div>
    <div
      class="flex flex-col md:flex-row items-start md:items-center gap-3 w-full"
    >
      <div class="w-full">
        <div class="h11 wv-font-black">{{ partyName }}</div>
        <div>
          <span class="promise-sum">{{ sumPartyPromises }}</span>
          <span> คำสัญญา</span>
        </div>
      </div>
      <div class="w-full">
        <span class="flex h-4 overflow-hidden">
          <span
            v-for="(item, i) in promises"
            :key="i"
            :style="`width:${item.countPercentage}%;`"
            :class="`bg-status-${item.status}`"
            :title="`${item.status}: ${item.count}`"
          ></span>
        </span>
      </div>
      <div>
        <NuxtLink :to="buttonUrl">
          <Button theme="primary-blue" class="h-10 w-full sm:w-max">
            <span>ดูคำสัญญา</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-2.26862e-07 6.74994L-2.92429e-07 5.24994L9 5.24994L4.875 1.12494L5.94 0.0599401L11.88 5.99994L5.94 11.9399L4.875 10.8749L9 6.74994L-2.26862e-07 6.74994Z"
              />
            </svg>
          </Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
