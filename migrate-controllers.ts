import { readdirSync, readFileSync, writeFileSync, renameSync, statSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'

const CONTROLLERS_DIR = './app/controllers'
const SUFFIX = '_controller.ts'
const TARGET_DIRS = ['validators', 'models', 'services', 'enums']

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

function toControllerFilename(file: string): string {
  let base = file.replace(/\.ts$/i, '')
  base = base.replace(/(_controller|controller)$/i, '')
  return `${toSnakeCase(base)}${SUFFIX}`
}

function rewriteImports(code: string): string {
  return code.replace(/from ['"]#app\/([^/'"]+)\/([^'"]+)['"]/g, (_match, type, file) => {
    const dir = type.toLowerCase()
    if (TARGET_DIRS.includes(dir)) {
      return `from '#${dir}/${toSnakeCase(file)}'`
    }
    return `from '#app/${type}/${file}'` // fallback
  })
}

function exposeAllMethods(code: string): string {
  return code.replace(/(private|protected)?\s*async\s+(\w+)\s*\(/g, (_m, _p, name) => {
    return `public async ${name}(`
  })
}

function processControllerFile(filePath: string): void {
  const code = readFileSync(filePath, 'utf-8')
  let updated = code

  updated = rewriteImports(updated)
  updated = exposeAllMethods(updated)

  writeFileSync(filePath, updated, 'utf-8')
  console.log(`✅ Updated contents of ${basename(filePath)}`)

  const currentName = basename(filePath)
  const expectedName = toControllerFilename(currentName)

  if (currentName !== expectedName) {
    const newPath = join(dirname(filePath), expectedName)
    renameSync(filePath, newPath)
    console.log(`🔁 Renamed: ${currentName} → ${expectedName}`)
  }
}

function run(): void {
  const files = readdirSync(CONTROLLERS_DIR)

  for (const file of files) {
    const fullPath = join(CONTROLLERS_DIR, file)
    if (statSync(fullPath).isFile() && file.endsWith('.ts')) {
      processControllerFile(fullPath)
    }
  }
}

run()
