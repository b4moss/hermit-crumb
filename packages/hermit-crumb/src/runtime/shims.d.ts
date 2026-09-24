/** Ambient shims so mkdist can emit runtime `.d.ts` without a full Nuxt prepare. */

declare type MaybeRefOrGetter<T> = T | Ref<T> | (() => T);

declare function useRuntimeConfig(): {
  public: Record<string, unknown>;
};

declare function useI18n(): {
  locale: { value: string };
  t: (key: string) => string;
};

declare function useHead(input: unknown): void;

declare function computed<T>(getter: () => T): { value: T };

declare function toValue<T>(source: MaybeRefOrGetter<T>): T;

declare function useState<T>(key: string, init?: () => T): { value: T };

declare function useRoute(): { path: string; hash: string };

declare function onMounted(fn: () => void): void;

declare function onBeforeUnmount(fn: () => void): void;

declare function watch(
  source: unknown,
  cb: (...args: unknown[]) => void,
  options?: unknown,
): void;

declare function nextTick(fn?: () => void): Promise<void>;

interface Ref<T> {
  value: T;
}
