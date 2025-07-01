import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, extname, basename } from 'node:path'

const VALIDATORS_DIR = './app/validators'

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

function extractSchema(content: string): { schemaBlock: string; messagesBlock?: string } {
  const schemaMatch = content.match(/schema\s*=\s*schema\.create\(([^]*?)\)[;\n]/)
  const messagesMatch = content.match(/messages\s*=\s*({[^}]*})/)

  return {
    schemaBlock: schemaMatch ? schemaMatch[1] : '',
    messagesBlock: messagesMatch ? messagesMatch[1] : undefined,
  }
}

function convertToVine(schemaContent: string): string {
  return schemaContent
    .replace(/schema\.string\(([^)]*)\)/g, 'vine.string()') // simple string
    .replace(/schema\.number\(([^)]*)\)/g, 'vine.number()')
    .replace(/schema\.boolean\(\)/g, 'vine.boolean()')
    .replace(/rules\.required\(\)/g, '.required()')
    .replace(/rules\.email\(\)/g, '.email()')
    .replace(/rules\.exists\(\{([^\}]+)\}\)/g, (_m, args) => `.exists({ ${args.trim()} })`)
    .replace(/,\s*\]/g, ']') // trailing comma cleanup
}

function processFile(filePath: string): void {
  const content = readFileSync(filePath, 'utf-8')

  const fileName = basename(filePath, '.ts')
  const varName = toCamelCase(fileName.replace(/_validator$/, ''))

  if (!content.includes('schema.create')) return

  const { schemaBlock, messagesBlock } = extractSchema(content)
  const transformedSchema = convertToVine(schemaBlock)

  const final = `import vine from '@vinejs/vine'

export const ${varName} = vine.object(${transformedSchema})
${messagesBlock ? `\nexport const ${varName}Messages = ${messagesBlock}` : ''}
`

  writeFileSync(filePath, final.trim() + '\n', 'utf-8')
  console.log(`✅ Transformed: ${filePath}`)
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
