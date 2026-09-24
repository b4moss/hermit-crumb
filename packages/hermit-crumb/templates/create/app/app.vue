<script setup lang="ts">
const config = useRuntimeConfig();

const siteName = computed(() => String(config.public.siteName || "Doc Site"));

useHead({
  titleTemplate: (title) =>
    title ? `${title} :: ${siteName.value}` : siteName.value,
});

/** html lang/dir plus canonical and hreflang alternates for every route. */
const localeHead = useLocaleHead({ dir: true, lang: true, seo: true });

// @nuxtjs/i18n MetaAttrs is not assignable to Unhead ResolvableLink/Meta.
useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: localeHead.value.meta,
}) as never);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
