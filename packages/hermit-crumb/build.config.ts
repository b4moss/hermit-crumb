import { defineBuildConfig } from "unbuild";

/**
 * `@nuxt/module-builder` merges the nearest package `tsconfig` into mkdist.
 * Inherited `rootDir` / `outDir` from the package entry config make mkdist emit
 * empty runtime `.d.ts` files — strip them and keep declaration emit working.
 */
export default defineBuildConfig({
  failOnWarn: false,
  hooks: {
    "mkdist:entry:options"(_ctx, _entry, options) {
      options.typescript = {
        ...options.typescript,
        compilerOptions: {
          ...(options.typescript?.compilerOptions || {}),
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          lib: ["ES2022", "DOM"],
          strict: true,
          skipLibCheck: true,
          declaration: true,
          types: ["node"],
          rootDir: undefined,
          outDir: undefined,
        },
      };
      options.pattern = [
        "**",
        "!**/tsconfig.json",
        "!**/shims.d.ts",
        "!**/*.stories.{js,cts,mts,ts,jsx,tsx}",
        "!**/*.{spec,test}.{js,cts,mts,ts,jsx,tsx}",
      ];
    },
  },
});
