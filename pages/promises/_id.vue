<script lang="ts" setup>
import { computed, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  matchedPromise,
  titleText,
  descriptionMap,
  imageUrl,
} from '@/utils/promises-meta';
import promises from '@/data/promises.json';
import PromiseCard from '@/components/promise-card/promise-card.vue';
import LinkBanner from '@/components/link-banner.vue';
import FormLink from '@/components/form-link.vue';
import { PromiseStatus, TrackingPromise } from '@/models/promise';
import { createMetadata } from '~/utils/metadata';

const $config = useRuntimeConfig();
const $route = useRoute();

const state = reactive({
  slug: $route.params,
});

const id = computed(() => parseInt(state.slug?.id, 10));
const promise = computed(() =>
  matchedPromise(promises as TrackingPromise[], id.value)
);

onMounted(() => {
  if (!promise.value) {
    return useHead(createMetadata());
  }

  const baseImageUrl = `https://raw.githubusercontent.com/wevisdemo/promise-tracker/main/static/og`;
  const { title, party, status } = promise.value as TrackingPromise;

  return useHead(
    createMetadata({
      pageName: titleText(title, party),
      description: descriptionMap.get(status as PromiseStatus),
      image: imageUrl(baseImageUrl, status),
    })
  );
});
</script>

<template>
  <div
    class="flex flex-col items-center z-10 bg-no-repeat bg-fixed bg-cover"
    :style="{
      backgroundImage: `url(${$config.path.images}/background/blog_bg.png)`,
    }"
  >
    <div class="blog-header wv-font-kondolar wv-h10">
      <img
        class="w-16 h-16 mr-3"
        :src="`${$config.path.images}/status/default.png`"
        alt="promise-logo"
      />
      <div>
        <h1 class="wv-font-bold">PROMISE TRACKER</h1>
        <h2>สำรวจคำสัญญาของพรรคการเมืองที่ผ่านมารักษาคำสัญญาได้แค่ไหน ?</h2>
      </div>
    </div>
    <div
      class="mt-10 sm:mt-20 grid gap-6 max-w-4xl justify-items-center px-2 sm:px-6"
    >
      <PromiseCard
        v-if="promise"
        class="shadow-2xl"
        :open-state="true"
        :promise="promise"
      />
      <LinkBanner
        theme="ultramarine"
        icon-image="article/explore.png"
        title-text="PROMISE TRACKER"
        body-text="สำรวจคำสัญญาของพรรคการเมืองที่ผ่านมารักษาคำสัญญาได้แค่ไหน ?"
        button-text="ดูคำสัญญา"
        button-url="/explore"
      />
      <LinkBanner
        theme="ultramarine"
        icon-image="article/article.png"
        title-text="วิธีตรวจสอบคำสัญญา"
        body-text="หากนัก/พรรคการเมืองที่ได้เข้าไปเป็น รัฐบาล แล้วไม่ทำตามสัญญา มีกระบวนการตรวจ สอบอย่างไรบ้าง"
        button-text="อ่านเพิ่มเติม"
        button-url="/guide"
      />
      <FormLink />
    </div>
  </div>
</template>

<style scoped>
.blog-header {
  @apply flex justify-center items-center bg-gradient-to-b from-ultramarine to-transparent text-white w-full h-28 p-4;
}
</style>
