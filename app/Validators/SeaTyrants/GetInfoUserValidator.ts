import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetInfoUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.required(), rules.email()]),
  })

  public messages = {
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid',
  }
}
