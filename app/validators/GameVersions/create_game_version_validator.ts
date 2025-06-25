import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class CreateGameVersionValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    version: schema.string({}, [rules.required()]),
    is_available: schema.boolean([rules.required()]),
  })

  public messages = {
    'version.required': 'La version est requise.',
    'is_available.required': 'Le statut de disponibilité est requis.',
    'is_available.boolean': 'Le statut de disponibilité doit être un booléen.',
  }
}
