import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class ResendNewCodeVerificationAccountValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.required()]),
  })

  public messages = {
    'email.required': 'Email is required',
  }
}
