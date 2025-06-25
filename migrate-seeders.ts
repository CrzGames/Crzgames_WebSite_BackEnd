import { readdirSync, readFileSync, writeFileSync, renameSync, statSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'

const SEEDERS_DIR = './database/seeders/files'
const TARGET_DIRS = ['models', 'services', 'enums', 'validators']

/**
 * Convertit en snake_case
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

/**
 * Renomme les fichiers seeders (snake_case)
 */
function toSeederFilename(file: string): string {
  const base = file.replace(/\.ts$/i, '')
  return `${toSnakeCase(base)}.ts`
}

/**
 * Réécrit tous les imports
 */
function rewriteSeederImports(code: string): string {
  let updated = code

  // ✅ Remplacer import de BaseSeeder
  updated = updated.replace(
    /import\s+BaseSeeder\s+from\s+['"]@ioc:Adonis\/Lucid\/Seeder['"]/g,
    `import { BaseSeeder } from '@adonisjs/lucid/seeders'`,
  )

  // ✅ Corriger tous les imports App/... ou #app/...
  updated = updated.replace(
    /import\s+(\w+)\s+from\s+['"](App|#app)\/([^/'"]+)\/([^'"]+)['"]/g,
    (_match, identifier, _root, type, path) => {
      const dir = type.toLowerCase()
      if (TARGET_DIRS.includes(dir)) {
        return `import ${identifier} from '#${dir}/${toSnakeCase(path)}'`
      }
      return `import ${identifier} from '#${dir}/${toSnakeCase(path)}'`
    },
  )

  return updated
}

/**
 * Traite un fichier seeder
 */
function processSeederFile(filePath: string): void {
  const currentName = basename(filePath)
  const expectedName = toSeederFilename(currentName)
  const dir = dirname(filePath)
  const newPath = join(dir, expectedName)

  let content = readFileSync(filePath, 'utf-8')
  const updated = rewriteSeederImports(content)

  if (updated !== content) {
    writeFileSync(filePath, updated, 'utf-8')
    console.log(`✅ Updated contents of ${currentName}`)
  } else {
    console.log(`⏭️  Skipped content: ${currentName}`)
  }

  if (currentName !== expectedName) {
    renameSync(filePath, newPath)
    console.log(`🔁 Renamed: ${currentName} → ${expectedName}`)
  }
}

/**
 * Démarre la migration
 */
function run(): void {
  const files = readdirSync(SEEDERS_DIR)

  for (const file of files) {
    const fullPath = join(SEEDERS_DIR, file)
    if (statSync(fullPath).isFile() && file.endsWith('.ts')) {
      processSeederFile(fullPath)
    }
  }
}

run()
