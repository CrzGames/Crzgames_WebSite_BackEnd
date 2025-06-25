import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class UpdateGameVersionValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    is_available: schema.boolean([rules.required()]),
  })

  public messages = {
    'is_available.required': 'Le statut de disponibilité est requis.',
    'is_available.boolean': 'Le statut de disponibilité doit être un booléen.',
  }
}
