import { readdirSync, readFileSync, writeFileSync, renameSync, statSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'

const MODELS_DIR = './app/models'

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

function toModelFilename(file: string): string {
  const base = file.replace(/\.ts$/i, '')
  return `${toSnakeCase(base)}.ts`
}

function addDeclareToColumns(code: string): string {
  const decoratorRegex =
    /(@(column(?:\.\w+)?|belongsTo|hasMany|hasOne|manyToMany)\([^)]*\)\s*\n\s*)(\s*)(public|protected|private)?\s*(async\s+)?(\w+\s*[:=])/g

  return code.replace(
    decoratorRegex,
    (_match, decoratorLine, _decorator, indent, accessModifier, asyncKeyword, rest) => {
      const access = accessModifier ? `${accessModifier} ` : ''
      const asyncPart = asyncKeyword ?? ''
      return `${decoratorLine}${indent}declare ${access}${asyncPart}${rest}`
    },
  )
}

function rewriteModelImports(code: string): string {
  return code.replace(/from\s+['"]#app\/Models\/([^'"]+)['"]/g, (_match, modelName) => {
    return `from '#models/${toSnakeCase(modelName)}'`
  })
}

function processModelFile(filePath: string): void {
  const currentName = basename(filePath)
  const expectedName = toModelFilename(currentName)
  const currentDir = dirname(filePath)
  let content = readFileSync(filePath, 'utf-8')

  const updated = rewriteModelImports(addDeclareToColumns(content))

  if (updated !== content) {
    writeFileSync(filePath, updated, 'utf-8')
    console.log(`✅ Updated contents of ${currentName}`)
  } else {
    console.log(`⏭️  Skipped content: ${currentName}`)
  }

  if (currentName !== expectedName) {
    const newPath = join(currentDir, expectedName)
    renameSync(filePath, newPath)
    console.log(`🔁 Renamed: ${currentName} → ${expectedName}`)
  }
}

function run(): void {
  const files = readdirSync(MODELS_DIR)

  for (const file of files) {
    const fullPath = join(MODELS_DIR, file)
    if (statSync(fullPath).isFile() && file.endsWith('.ts')) {
      processModelFile(fullPath)
    }
  }
}

run()
