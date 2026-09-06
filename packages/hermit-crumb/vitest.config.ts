import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  define: {
    "import.meta.client": true,
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./test/fixtures", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.{ts,mjs}"],
      exclude: ["src/runtime/styles/**"],
    },
  },
});
