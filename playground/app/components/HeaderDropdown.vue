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
  <div
    ref="root"
    class="dropdown"
    :class="{ 'dropdown--icon': iconOnly }"
    :data-open="open ? 'true' : 'false'"
  >
    <button
      :id="triggerId"
      type="button"
      class="dropdown-trigger"
      :aria-label="label"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-controls="listId"
      @click="toggle"
    >
      <slot name="trigger">
        <template v-if="!iconOnly">
          <span class="trigger-text trigger-text--full">{{ triggerText }}</span>
          <span class="trigger-text trigger-text--compact">
            {{ compactText || triggerText }}
          </span>
          <span class="chevron" aria-hidden="true" />
        </template>
      </slot>
      <span v-if="!iconOnly && $slots.trigger" class="chevron" aria-hidden="true" />
    </button>
    <div
      v-show="open"
      :id="listId"
      class="dropdown-menu"
      role="listbox"
      :aria-labelledby="triggerId"
    >
      <slot :close="close" />
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 2.25rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 0.35rem;
  background: var(--color-surface);
  color: var(--color-ink);
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
}

.dropdown--icon .dropdown-trigger {
  justify-content: center;
  width: 2.25rem;
  padding: 0;
  color: var(--color-muted);
}

.dropdown--icon .dropdown-trigger:hover {
  color: var(--color-ink);
}

.dropdown-trigger:hover {
  background: var(--color-accent-soft);
}

.dropdown[data-open="true"] .dropdown-trigger {
  border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
}

.trigger-text--compact {
  display: none;
}

.chevron {
  width: 0.4rem;
  height: 0.4rem;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateY(-1px) rotate(45deg);
  opacity: 0.7;
  flex-shrink: 0;
}

.dropdown[data-open="true"] .chevron {
  transform: translateY(1px) rotate(-135deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  z-index: 40;
  min-width: max(100%, 11.5rem);
  width: max-content;
  max-width: min(18rem, calc(100vw - 2rem));
  padding: 0.3rem;
  border: 1px solid var(--color-border);
  border-radius: 0.45rem;
  background: var(--color-surface);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--color-ink) 12%, transparent);
}

@media (max-width: 640px) {
  .dropdown:not(.dropdown--icon) .dropdown-trigger {
    min-width: 2.25rem;
    justify-content: center;
    padding: 0.35rem 0.45rem;
  }

  .dropdown:not(.dropdown--icon) .trigger-text--full {
    display: none;
  }

  .dropdown:not(.dropdown--icon) .trigger-text--compact {
    display: inline;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .dropdown-menu {
    min-width: 12.5rem;
    padding: 0.4rem;
  }
}
</style>
