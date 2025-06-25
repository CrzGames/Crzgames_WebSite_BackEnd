import { readdirSync, readFileSync, writeFileSync, renameSync, statSync } from 'node:fs'
import { join, basename, extname } from 'node:path'

const SERVICES_DIR = './app/services'

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

function toExpectedFilename(name: string): string {
  const base = name.replace(/\.ts$/, '')
  return `${toSnakeCase(base)}.ts`
}

function rewriteImports(code: string): string {
  return code.replace(/from ['"]#app\/([^/'"]+)\/([^'"]+)['"]/g, (_match, type, file) => {
    const dir = type.toLowerCase()
    const snakeFile = toSnakeCase(file)
    return `from '#${dir}/${snakeFile}'`
  })
}

function processServiceFile(filePath: string): void {
  let code = readFileSync(filePath, 'utf-8')
  code = rewriteImports(code)
  writeFileSync(filePath, code, 'utf-8')

  const currentName = basename(filePath)
  const expectedName = toExpectedFilename(currentName)
  if (currentName !== expectedName) {
    const newPath = join(SERVICES_DIR, expectedName)
    renameSync(filePath, newPath)
    console.log(`🔁 Renamed: ${currentName} → ${expectedName}`)
  } else {
    console.log(`✅ Updated: ${currentName}`)
  }
}

function run(): void {
  const files = readdirSync(SERVICES_DIR)
  for (const file of files) {
    const fullPath = join(SERVICES_DIR, file)
    if (statSync(fullPath).isFile() && extname(file) === '.ts') {
      processServiceFile(fullPath)
    }
  }
}

run()
