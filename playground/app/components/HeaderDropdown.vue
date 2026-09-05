<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    triggerText?: string;
    compactText?: string;
    /** Icon-only trigger (e.g. gear). Uses #trigger slot when provided. */
    iconOnly?: boolean;
  }>(),
  {
    triggerText: "",
    compactText: "",
    iconOnly: false,
  },
);

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const triggerId = useId();
const listId = useId();

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node | null;
  if (!root.value || !target || root.value.contains(target)) {
    return;
  }
  close();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    close();
  }
}

watch(open, (isOpen) => {
  if (!import.meta.client) {
    return;
  }
  if (isOpen) {
    // Defer outside-dismiss so the opening tap cannot immediately close on
    // touch / Mobile Safari (pointerdown may still be in the same gesture).
    queueMicrotask(() => {
      if (!open.value) {
        return;
      }
      document.addEventListener("pointerdown", onDocumentPointerDown);
      document.addEventListener("keydown", onKeydown);
    });
  } else {
    document.removeEventListener("pointerdown", onDocumentPointerDown);
    document.removeEventListener("keydown", onKeydown);
  }
});

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return;
  }
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  document.removeEventListener("keydown", onKeydown);
});

defineExpose({ close, open });
</script>

<template>
  <!-- Avoid class name "dropdown" — Pico CSS owns that and shifts layout. -->
  <div
    ref="root"
    class="hc-menu"
    :class="{ 'hc-menu--icon': iconOnly }"
    :data-open="open ? 'true' : 'false'"
  >
    <button
      :id="triggerId"
      type="button"
      class="hc-menu__trigger"
      :aria-label="label"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-controls="listId"
      @click="toggle"
    >
      <slot name="trigger">
        <template v-if="!iconOnly">
          <span class="hc-menu__text hc-menu__text--full">{{ triggerText }}</span>
          <span class="hc-menu__text hc-menu__text--compact">
            {{ compactText || triggerText }}
          </span>
          <span class="hc-menu__chevron" aria-hidden="true" />
        </template>
      </slot>
      <span
        v-if="!iconOnly && $slots.trigger"
        class="hc-menu__chevron"
        aria-hidden="true"
      />
    </button>
    <div
      v-show="open"
      :id="listId"
      class="hc-menu__panel"
      role="listbox"
      :aria-labelledby="triggerId"
    >
      <slot :close="close" />
    </div>
  </div>
</template>

<style scoped>
.hc-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin: 0;
  vertical-align: middle;
  line-height: 0;
}

.hc-menu__trigger {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin: 0;
  min-height: 2.25rem;
  height: 2.25rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 0.35rem;
  background: var(--color-surface);
  color: var(--color-ink);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
}

.hc-menu--icon .hc-menu__trigger {
  width: 2.25rem;
  padding: 0;
  border-color: transparent;
  background: transparent;
  color: var(--color-muted);
  line-height: 0;
}

.hc-menu--icon .hc-menu__trigger:hover {
  color: var(--color-ink);
  background: var(--color-accent-soft);
}

.hc-menu__trigger:hover {
  background: var(--color-accent-soft);
}

.hc-menu[data-open="true"] .hc-menu__trigger {
  border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
}

.hc-menu--icon[data-open="true"] .hc-menu__trigger {
  border-color: transparent;
  color: var(--color-ink);
  background: var(--color-accent-soft);
}

.hc-menu__text--compact {
  display: none;
}

.hc-menu__chevron {
  width: 0.4rem;
  height: 0.4rem;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateY(-1px) rotate(45deg);
  opacity: 0.7;
  flex-shrink: 0;
}

.hc-menu[data-open="true"] .hc-menu__chevron {
  transform: translateY(1px) rotate(-135deg);
}

.hc-menu__panel {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 40;
  box-sizing: border-box;
  min-width: max(100%, 10.5rem);
  width: max-content;
  max-width: min(16rem, calc(100vw - 2rem));
  margin: 0;
  padding: 0.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.45rem;
  background: var(--color-surface);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--color-ink) 12%, transparent);
  line-height: normal;
}

@media (max-width: 640px) {
  .hc-menu:not(.hc-menu--icon) .hc-menu__trigger {
    min-width: 2.25rem;
    padding: 0.35rem 0.45rem;
  }

  .hc-menu:not(.hc-menu--icon) .hc-menu__text--full {
    display: none;
  }

  .hc-menu:not(.hc-menu--icon) .hc-menu__text--compact {
    display: inline;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .hc-menu__panel {
    min-width: 11.5rem;
  }
}
</style>
