import { readdirSync, readFileSync, writeFileSync, renameSync, statSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'

const FACTORIES_DIR = './database/factories'

const TARGET_DIRS = ['models', 'services', 'enums', 'validators']

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}

function toFactoryFilename(file: string): string {
  const base = file.replace(/\.ts$/i, '')
  return `${toSnakeCase(base)}.ts`
}

function rewriteFactoryImports(code: string): string {
  let updated = code

  // Remplace l'import de Factory
  updated = updated.replace(
    /import\s+Factory\s+from\s+['"]@ioc:Adonis\/Lucid\/Factory['"]/g,
    `import factory from '@adonisjs/lucid/factories'`,
  )

  // Corrige les appels à Factory.define → factory.define
  updated = updated.replace(/\bFactory\.define\(/g, 'factory.define(')

  // Réécrit les imports App/xxx/Model → #xxx/model
  updated = updated.replace(
    /import\s+(\w+)\s+from\s+['"](App|#app)\/([^/'"]+)\/([^'"]+)['"]/g,
    (_match, identifier, _root, type, path) => {
      const dir = type.toLowerCase()
      if (TARGET_DIRS.includes(dir)) {
        return `import ${identifier} from '#${dir}/${toSnakeCase(path)}'`
      }
      return `import ${identifier} from '#${dir}/${toSnakeCase(path)}'` // fallback cohérent
    },
  )

  return updated
}

function processFactoryFile(filePath: string): void {
  const currentName = basename(filePath)
  const expectedName = toFactoryFilename(currentName)
  const dir = dirname(filePath)
  const newPath = join(dir, expectedName)

  let content = readFileSync(filePath, 'utf-8')
  const updated = rewriteFactoryImports(content)

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

function run(): void {
  const files = readdirSync(FACTORIES_DIR)

  for (const file of files) {
    const fullPath = join(FACTORIES_DIR, file)
    if (statSync(fullPath).isFile() && file.endsWith('.ts')) {
      processFactoryFile(fullPath)
    }
  }
}

run()
