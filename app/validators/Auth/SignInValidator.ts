import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class SignInValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.email(), rules.required()]),
    password: schema.string({ trim: true }, [rules.required()]),
  })

  public messages = {
    'email.required': 'Email is required',
    'email.email': 'Email format is invalid',
    'password.required': 'Password is required',
  }
}
