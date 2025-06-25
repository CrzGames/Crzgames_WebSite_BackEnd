import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'
import { CustomMessages } from '@adonisjs/validator/types'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    token: schema.string([rules.required(), rules.exists({ table: 'password_reset_tokens', column: 'token' })]),
    newPassword: schema.string({}, [
      rules.confirmed(),
      rules.minLength(8),
      rules.regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/),
    ]),
  })

  public messages: CustomMessages = {}
}
