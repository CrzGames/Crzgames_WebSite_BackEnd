import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateGameVersionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    version: schema.string({}, [rules.required()]),
    is_available: schema.boolean([rules.required()]),
  })

  public messages = {
    'version.required': 'La version est requise.',
    'isAvailable.required': 'Le statut de disponibilité est requis.',
    'isAvailable.boolean': 'Le statut de disponibilité doit être un booléen.',
  }
}
