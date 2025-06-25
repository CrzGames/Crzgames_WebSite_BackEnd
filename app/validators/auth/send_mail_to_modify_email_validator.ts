import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class SendMailToModifyEmailValidator {
  constructor(protected ctx: HttpContext) {}

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
