import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateGameVersionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    is_available: schema.boolean([rules.required()]),
  })

  public messages = {
    'is_available.required': 'Le statut de disponibilité est requis.',
    'is_available.boolean': 'Le statut de disponibilité doit être un booléen.',
  }
}
