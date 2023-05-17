<script lang="ts" setup>
import { computed, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PromiseOverview from '@/components/explore/promise-overview/promise-overview.vue';
import promises from '@/data/promises.json';
import TopicGroup from '@/components/explore/topic-group/topic-group.vue';
import FilterPanel from '@/components/explore/filter-panel/filter-panel.vue';
import ToggleList, { ListOption } from '@/components/toggle/toggle-list.vue';
import Button from '@/components/button.vue';
import LinkBanner from '@/components/link-banner.vue';
import FormLink from '@/components/form-link.vue';
import { PromiseTopic, PromiseStatus, TrackingPromise } from '@/models/promise';
import { Filter, FilterType } from '~/models/filter';
import { createMetadata } from '~/utils/metadata';
// @ts-ignore
import DefaultLayout from '@/components/layouts/default.vue';

enum GroupBy {
  Topic = 'topic',
  Status = 'status',
}

const checkFilterOnPromise = (
  { type, value }: Filter,
  promise: TrackingPromise
): boolean => {
  switch (type) {
    case FilterType.Party:
      return promise.party === value;
    case FilterType.Status:
      return promise.status === value;
    case FilterType.Topic:
      return promise.topic === value;
    case FilterType.Keyword:
      return promise.title.includes(value);
    default:
      return false;
  }
};

const $router = useRouter();

const state = reactive({
  topics: [
    PromiseTopic.Equality,
    PromiseTopic.Security,
    PromiseTopic.Foreign,
    PromiseTopic.Administration,
    PromiseTopic.Culture,
    PromiseTopic.Economics,
    PromiseTopic.Environmental,
  ],
  statuses: [
    PromiseStatus.NoData,
    PromiseStatus.Proposed,
    PromiseStatus.Paused,
    PromiseStatus.Working,
    PromiseStatus.Done,
  ],
  filters: [] as Filter[],
  groupBy: GroupBy.Topic as GroupBy,
  groupByOptions: [
    {
      label: 'ตามประเด็น',
      value: GroupBy.Topic,
    },
    {
      label: 'ตามสถานะ',
      value: GroupBy.Status,
    },
  ] as ListOption[],
});

useHead(createMetadata({ pageName: 'ดูคำสัญญา' }));

const filteredPromises = computed(() => {
  return state.filters.length > 0
    ? (promises as TrackingPromise[]).filter((promise) =>
        state.filters.every((filter: Filter) =>
          checkFilterOnPromise(filter, promise)
        )
      )
    : (promises as TrackingPromise[]);
});

onMounted(() => {
  state.filters = Object.entries($router.currentRoute.value.query).map(
    ([type, value]) => ({ type, value } as Filter)
  );
});

watch(
  () => state.filters,
  () => {
    const query = state.filters.reduce(
      (q, { type, value }) => ({ ...q, [type]: value }),
      {}
    );

    $router.push({ query });
    scrollToTop();
  }
);

const removeFilter = (filter: Filter) => {
  state.filters = state.filters.filter(({ type }) => filter.type !== type);
};

const setGroupFilter = (
  type: FilterType.Status | FilterType.Topic,
  value: PromiseStatus | PromiseTopic
) => {
  const existingFilter = state.filters.find((filter) => filter.type === type);

  if (existingFilter?.value === value) return;

  state.filters = existingFilter
    ? state.filters.map((filter) =>
        filter.value === value ? ({ type, value } as Filter) : filter
      )
    : [...state.filters, { type, value } as Filter];
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <DefaultLayout>
    <div
      class="flex flex-row justify-center bg-black min-h-screen px-3 py-6 md:py-12"
    >
      <div class="relative flex flex-row w-full max-w-7xl">
        <FilterPanel
          v-model="state.filters"
          @input="(e) => (state.filters = e)"
        />

        <div class="w-full flex-1 flex flex-col items-center space-y-8">
          <PromiseOverview
            :promises="filteredPromises"
            :filters="state.filters"
            class="max-w-screen-lg mx-auto"
            @removefilter="removeFilter($event)"
          />

          <div class="flex flex-col md:flex-row gap-2 md:gap-6 items-center">
            <div class="flex flex-row space-x-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4.5 9H13.5" />
                <path d="M1.6875 5.625H16.3125" />
                <path d="M7.3125 12.375H10.6875" />
              </svg>
              <p class="wv-font-condolar wv-h11 text-white">เรียงคำสัญญาตาม</p>
            </div>

            <ToggleList
              v-model="state.groupBy"
              :options="state.groupByOptions"
              align="horizontal"
              @input="(e) => (state.groupBy = e)"
            />
          </div>

          <div class="w-full flex flex-col md:px-6">
            <TopicGroup
              v-for="group in state.groupBy === 'topic'
                ? state.topics
                : state.statuses"
              :key="`${state.groupBy}-${group}`"
              class=""
              :topic="state.groupBy === 'topic' ? group : undefined"
              :status="state.groupBy === 'status' ? group : undefined"
              :promises="filteredPromises"
              :promise-per-page="
                state.filters.find(({ type }: any) => type === state.groupBy) ? 0 : 3
              "
              @viewGroup="setGroupFilter(state.groupBy as any, group)"
            />
          </div>

          <div class="block w-full border-b border-white border-dashed h-0" />

          <div class="flex flex-col space-y-6 px-1">
            <LinkBanner
              theme="transparent-gray"
              icon-image="article/article.png"
              title-text="วิธีตรวจสอบคำสัญญา"
              body-text="หากนัก/พรรคการเมืองที่ได้เข้าไปเป็น รัฐบาล แล้วไม่ทำตามสัญญา มีกระบวนการตรวจ สอบอย่างไรบ้าง"
              button-text="อ่านเพิ่มเติม"
              button-url="guide"
            />
            <FormLink />
          </div>
        </div>

        <Button
          class="fixed lg:sticky self-end top-3 lg:bottom-4 right-3"
          @click="scrollToTop"
        >
          <div class="flex flex-row -mx-2 -my-1 lg:m-0">
            <span class="hidden xl:block mr-1">กลับด้านบน</span
            ><svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              class="fill-current"
            >
              <path
                d="M9.74994 15L8.24994 15L8.24994 6L4.12494 10.125L3.05994 9.06L8.99994 3.12L14.9399 9.06L13.8749 10.125L9.74994 6L9.74994 15Z"
              />
            </svg>
          </div>
        </Button>
      </div>
    </div>
  </DefaultLayout>
</template>
