import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'

const ROUTES_DIR = './start/routes'

interface ControllerImport {
  varName: string
  importPath: string
}

function camelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // camelCase → camel_case
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // HTMLParser → HTML_Parser
    .replace(/[-\s]+/g, '_') // tirets ou espaces
    .toLowerCase()
}

function migrateFile(filePath: string): void {
  const fileName = basename(filePath)
  let content = readFileSync(filePath, 'utf-8')

  const controllerRegex = /['"]([\w/]+)Controller\.([\w]+)['"]/g
  const middlewareSingleRegex = /\.middleware\((['"`])([\w-]+)\1\)/g
  const middlewareArrayRegex = /\.middleware\(\[(.*?)\]\)/gs

  const controllerImports: ControllerImport[] = []
  const importVarSet = new Set<string>()

  // Convert 'GamesController.start' → [GamesController, 'start']
  content = content.replace(controllerRegex, (_match, ctrlPath, method) => {
    const ctrlBase = ctrlPath.split('/').pop() ?? ctrlPath
    const varName = `${ctrlBase}Controller`

    if (!importVarSet.has(varName)) {
      controllerImports.push({
        varName,
        importPath: `#controllers/${toSnakeCase(ctrlPath)}_controller`,
      })
      importVarSet.add(varName)
    }

    return `[${varName}, '${method}']`
  })

  // Convert middleware(['auth', 'acl']) → use([middleware.auth(), middleware.acl()])
  content = content.replace(middlewareArrayRegex, (_match, inside) => {
    const items = inside
      .split(',')
      .map((i) => i.trim().replace(/^['"`]|['"`]$/g, ''))
      .filter(Boolean)
    const transformed = items.map((name) => `middleware.${camelCase(name)}()`).join(', ')
    return `.use([${transformed}])`
  })

  // Convert middleware('auth') → use(middleware.auth())
  content = content.replace(middlewareSingleRegex, (_match, _q, name) => {
    return `.use(middleware.${camelCase(name)}())`
  })

  // Add import for middleware if used
  const usesMiddleware = content.includes('middleware.')
  const alreadyHasMiddlewareImport = content.includes(`import { middleware }`)
  if (usesMiddleware && !alreadyHasMiddlewareImport) {
    content = `import { middleware } from '#start/kernel'\n` + content
  }

  // Inject controller imports
  if (controllerImports.length > 0) {
    const routerLine = `import router from '@adonisjs/core/services/router'`
    const importBlock =
      routerLine +
      '\n' +
      controllerImports.map((c) => `const ${c.varName} = () => import('${c.importPath}')`).join('\n')

    content = content.replace(routerLine, importBlock)
  }

  writeFileSync(filePath, content, 'utf-8')
  console.log(`✅ Migrated ${fileName}`)
}

function run(): void {
  const files = readdirSync(ROUTES_DIR).filter((f) => f.endsWith('.ts'))
  for (const file of files) {
    const fullPath = join(ROUTES_DIR, file)
    migrateFile(fullPath)
  }
}

run()
