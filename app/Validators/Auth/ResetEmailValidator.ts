import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetEmailValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string({ trim: true }, [rules.required()]),
    newEmail: schema.string({ trim: true }, [
      rules.email(),
      rules.required(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
  })

  public messages = {
    'token.required': 'Token is required',
    'newEmail.required': 'New Email is required',
    'newEmail.email': 'New Email format is not valid',
    'newEmail.unique': 'This new email is already in use',
  }
}
