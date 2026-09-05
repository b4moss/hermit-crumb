import { mkdir, writeFile, cp, rm, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const require = createRequire(import.meta.url)

function resolveTscBin() {
  try {
    return require.resolve('typescript/bin/tsc', { paths: [root] })
  } catch {
    try {
      return require.resolve('typescript/bin/tsc')
    } catch {
      return null
    }
  }
}

await rm(dist, { recursive: true, force: true })
await mkdir(dist, { recursive: true })

const tscBin = resolveTscBin()
if (!tscBin) {
  console.error('build: typescript is not installed')
  process.exit(1)
}

const tsc = spawnSync(process.execPath, [tscBin, '-p', 'tsconfig.json'], {
  cwd: root,
  stdio: 'inherit',
})
if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1)
}

await access(join(dist, 'module.js'))
await cp(join(dist, 'module.js'), join(dist, 'module.mjs'))

// Keep package exports' .d.ts path stable even if tsc layout changes.
try {
  await access(join(dist, 'module.d.ts'))
} catch {
  await writeFile(
    join(dist, 'module.d.ts'),
    `export interface HermitCrumbModuleOptions {}\nexport default function hermitCrumbModule(options?: HermitCrumbModuleOptions): { name: string }\n`,
    'utf8',
  )
}

console.log('build: wrote dist/module.mjs and dist/module.d.ts')
