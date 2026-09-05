<script setup lang="ts">
type LocaleOption = {
  code: string;
  name?: string;
};

const { t, locale, locales, setLocale } = useI18n();
const colorMode = useColorMode();

const languageOptions = computed(() => {
  const allowed = new Set(["ja", "en"]);
  const labels: Record<string, string> = {
    en: "English",
    ja: "日本語",
  };

  return (locales.value as LocaleOption[])
    .filter((item) => allowed.has(item.code))
    .map((item) => ({
      code: item.code,
      name: labels[item.code] ?? item.name ?? item.code,
    }));
});

const themeOptions = computed(() => [
  { value: "system", label: t("theme.system") },
  { value: "light", label: t("theme.light") },
  { value: "dark", label: t("theme.dark") },
]);

async function chooseLanguage(code: string, closeOuter: () => void) {
  if (code !== locale.value) {
    await setLocale(code);
  }
  closeOuter();
}

function chooseTheme(value: string, closeOuter: () => void) {
  colorMode.preference = value;
  closeOuter();
}
</script>

<template>
  <HeaderDropdown :label="t('nav.prefs')" icon-only>
    <template #trigger>
      <svg
        class="gear-icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.86 14.5a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.3.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"
        />
      </svg>
    </template>

    <template #default="{ close }">
      <div class="prefs-menu">
        <div class="section" :aria-label="t('nav.language')">
          <div class="section-label">{{ t("nav.language") }}</div>
          <div class="option-list">
            <button
              v-for="item in languageOptions"
              :key="item.code"
              type="button"
              class="option"
              role="option"
              :aria-selected="item.code === locale"
              :data-active="item.code === locale ? 'true' : 'false'"
              @click="chooseLanguage(item.code, close)"
            >
              {{ item.name }}
            </button>
          </div>
        </div>

        <div class="section" :aria-label="t('theme.label')">
          <div class="section-label">{{ t("theme.label") }}</div>
          <div class="option-list">
            <button
              v-for="item in themeOptions"
              :key="item.value"
              type="button"
              class="option"
              role="option"
              :aria-selected="item.value === colorMode.preference"
              :data-active="item.value === colorMode.preference ? 'true' : 'false'"
              @click="chooseTheme(item.value, close)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </HeaderDropdown>
</template>

<style scoped>
.gear-icon {
  display: block;
  flex-shrink: 0;
}

.prefs-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 9.5rem;
  width: max-content;
  max-width: min(16rem, calc(100vw - 2rem));
}

.section {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.125rem;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  min-width: 0;
}

.section + .section {
  margin: 0;
  padding-top: 0.25rem;
  border-top: 1px solid var(--color-border);
}

.section-label {
  display: block;
  box-sizing: border-box;
  margin: 0;
  padding: 0.15rem 0.5rem;
  color: var(--color-muted);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.2;
  text-transform: uppercase;
  white-space: nowrap;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0;
  padding: 0;
}

.prefs-menu button.option {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  min-height: 0;
  height: auto;
  padding: 0.35rem 0.5rem;
  border: 0;
  border-radius: 0.3rem;
  background: transparent;
  box-shadow: none;
  color: var(--color-ink);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
}

.prefs-menu button.option:hover {
  background: var(--color-accent-soft);
}

.prefs-menu button.option[data-active="true"] {
  color: var(--color-accent);
  font-weight: 600;
}

@media (max-width: 640px) {
  .prefs-menu {
    min-width: 10.5rem;
  }

  .prefs-menu button.option {
    padding: 0.45rem 0.5rem;
    font-size: 0.95rem;
  }
}
</style>
