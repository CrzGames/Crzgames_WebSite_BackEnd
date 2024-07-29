import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.required(),
      rules.exists({ table: 'users', column: 'email' }),
    ]),
  })

  public messages = {
    'email.required': 'Email is required',
    'email.email': 'Email format is not valid',
    'email.exists': 'No account found with this email',
  }
}
