// https://nuxt.com/docs/api/configuration/nuxt-config
import promises from './data/promises.json';
import { createMetadata } from './utils/metadata';

const BASE_PATH = process.env.BASE_PATH || '';
const { title, meta } = createMetadata();

export default defineNuxtConfig({
  target: 'static',

  app: {
    head: {
      title,
      htmlAttrs: {
        lang: 'th',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
        ...meta,
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${BASE_PATH}/favicon.ico` },
        {
          rel: 'manifest',
          href: `${BASE_PATH}/site.webmanifest`,
        },
        { rel: 'stylesheet', href: `${BASE_PATH}/fonts/typography.css` },
      ],
    },
  },
  css: [
    '@wevisdemo/ui/styles/typography.css',
    '@wevisdemo/ui/styles/components.css',
  ],
  plugins: [],

  components: true,

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      path: {
        base: BASE_PATH,
        images: `${BASE_PATH}/images`,
      },
    },
  },
  router: {
    base: BASE_PATH || '/',
  },
  generate: {
    async routes() {
      const promisesRoute = await Promise.all(
        promises.map((promise) => ({
          route: `/promises/${promise.id}`,
          payload: {
            promise,
          },
        }))
      );
      return [...promisesRoute];
    },
  },
  plausible: process.env.ENABLE_PLAUSIBLE
    ? {
        domain: 'promisetracker.wevis.info',
        apiHost: 'https://analytics.punchup.world',
      }
    : {},
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
