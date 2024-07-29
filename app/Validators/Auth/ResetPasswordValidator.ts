import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string([
      rules.required(),
      rules.exists({ table: 'password_reset_tokens', column: 'token' }),
    ]),
    newPassword: schema.string({}, [
      rules.confirmed(),
      rules.minLength(8),
      rules.regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/),
    ]),
  })

  public messages: CustomMessages = {}
}
