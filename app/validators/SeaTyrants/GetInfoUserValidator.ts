import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class GetInfoUserValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.required(), rules.email()]),
  })

  public messages = {
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid',
  }
}
