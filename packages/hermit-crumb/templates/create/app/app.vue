<script setup lang="ts">
const config = useRuntimeConfig();

const siteName = computed(() => String(config.public.siteName || "Doc Site"));

useHead({
  titleTemplate: (title) =>
    title ? `${title} :: ${siteName.value}` : siteName.value,
});

/** html lang/dir plus canonical and hreflang alternates for every route. */
const localeHead = useLocaleHead({ dir: true, lang: true, seo: true });

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
}));
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
