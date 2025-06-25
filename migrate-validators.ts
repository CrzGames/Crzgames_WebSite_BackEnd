import {
  readdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  statSync
} from 'node:fs'
import { join, basename, extname } from 'node:path'

const VALIDATORS_DIR = './app/validators'

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

function rewriteImports(code: string): string {
  return code.replace(/from ['"]#app\/([^/'"]+)\/([^'"]+)['"]/g, (_match, type, file) => {
    const dir = type.toLowerCase()
    const snakeFile = toSnakeCase(file)
    return `from '#${dir}/${snakeFile}'`
  })
}

function processFile(filePath: string): void {
  const code = readFileSync(filePath, 'utf-8')
  const updated = rewriteImports(code)
  writeFileSync(filePath, updated, 'utf-8')

  const oldName = basename(filePath)
  const expectedName = toSnakeCase(oldName.replace(/\.ts$/, '')) + '.ts'
  const expectedPath = join(filePath.replace(oldName, ''), expectedName)

  if (oldName !== expectedName) {
    renameSync(filePath, expectedPath)
    console.log(`📄 Renamed ${oldName} → ${expectedName}`)
  }
}

function traverseDir(dir: string): void {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      traverseDir(fullPath)
    } else if (stats.isFile() && extname(entry) === '.ts') {
      processFile(fullPath)
    }
  }
}

traverseDir(VALIDATORS_DIR)
