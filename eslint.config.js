import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin'
import eslintPluginStylistic from '@stylistic/eslint-plugin'
import eslintPluginJSDoc from 'eslint-plugin-jsdoc'
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports'
import eslintPluginImport from 'eslint-plugin-import'
import eslintParserTypeScript from '@typescript-eslint/parser'

// Configuration principale
const mainConfig = {
  files: [
    'tests/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    'config/**/*.{ts,tsx}',
    'start/**/*.{ts,tsx}',
    'providers/**/*.{ts,tsx}',
    'database/**/*.{ts,tsx}',
    'resources/**/*.{ts,tsx}',
    'contracts/**/*.{ts,tsx}',
    'config/**/*.{ts,tsx}',
    'commands/**/*.{ts,tsx}',
  ],
  plugins: {
    '@typescript-eslint': eslintPluginTypeScript,
    'eslint-plugin-prettier': eslintPluginPrettier,
    'eslint-plugin-unused-imports': eslintPluginUnusedImports,
    'eslint-plugin-jsdoc': eslintPluginJSDoc,
    '@stylistic-eslint-plugin': eslintPluginStylistic,
    'eslint-plugin-import': eslintPluginImport,
  },
  rules: {
    /* RAJOUTER LES RULES APRES FACTORISATION DU PROJET (monter de version de Adonis v6) */
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json'],
      },
    },
  },
  languageOptions: {
    parser: eslintParserTypeScript,
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    globals: {
      node: true,
    },
  },
}

// Configuration pour l'ignorance globale
// Bug issue : https://github.com/eslint/eslint/issues/17400
const ignoreConfig = {
  ignores: ['dist/**', 'build/**', 'node_modules/**'],
}

/**
 * @type {import("eslint").Linter.Config}
 *
 * Exportation combinée des configurations
 * eslint.config.{js,mjs,cjs} nouvelle syntaxe depuis la version >= 8.57
 */
//export default [mainConfig, ignoreConfig, eslintPluginJSDoc.configs['flat/recommended'], eslintConfigPrettier]
export default [mainConfig, ignoreConfig, eslintConfigPrettier]
