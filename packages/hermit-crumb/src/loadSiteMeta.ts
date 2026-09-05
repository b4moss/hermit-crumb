import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import {
  normalizeSiteMeta,
  type SiteMeta,
} from "./runtime/utils/siteMeta";

/**
 * Load site.meta.yaml with fallbacks:
 * 1. consumer `site.meta.yaml`
 * 2. consumer `site.meta.yaml.example`
 * 3. package-bundled example (optional)
 * 4. normalized defaults
 */
export function loadSiteMeta(
  rootDir: string,
  packageExamplePath?: string,
): SiteMeta {
  const candidates = [
    join(rootDir, "site.meta.yaml"),
    join(rootDir, "site.meta.yaml.example"),
    ...(packageExamplePath ? [packageExamplePath] : []),
  ];

  for (const path of candidates) {
    if (!existsSync(path)) continue;
    try {
      const raw = parseYaml(readFileSync(path, "utf8")) as Record<
        string,
        unknown
      > | null;
      return normalizeSiteMeta(raw || undefined);
    } catch (error) {
      console.warn(`[hermit-crumb] Failed to parse ${path}:`, error);
    }
  }

  return normalizeSiteMeta(undefined);
}
