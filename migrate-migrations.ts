import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const MIGRATIONS_DIR = './database/migrations'

function updateImport(code: string): string {
  return code.replace(
    /import\s+BaseSchema\s+from\s+['"]@ioc:Adonis\/Lucid\/Schema['"]/g,
    `import { BaseSchema } from '@adonisjs/lucid/schema'`,
  )
}

function processMigrationFile(filePath: string): void {
  const fileName = basename(filePath)
  const content = readFileSync(filePath, 'utf-8')
  const updated = updateImport(content)

  if (updated !== content) {
    writeFileSync(filePath, updated, 'utf-8')
    console.log(`✅ Migrated: ${fileName}`)
  } else {
    console.log(`⏭️  Skipped (no change): ${fileName}`)
  }
}

function run(): void {
  const files = readdirSync(MIGRATIONS_DIR)

  for (const file of files) {
    const fullPath = join(MIGRATIONS_DIR, file)
    if (statSync(fullPath).isFile() && file.endsWith('.ts')) {
      processMigrationFile(fullPath)
    }
  }
}

run()
