import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SignUpValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({ table: 'users', column: 'username' }),
      rules.minLength(4),
      rules.maxLength(22),
    ]),
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [
      rules.required(),
      rules.confirmed(),
      rules.minLength(8),
      rules.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\S]{8,}$/),
    ]),
    ip_address: schema.string({}, [rules.required()]),
    currency_code: schema.string({}, [rules.required()]),
  })

  public messages = {
    'password.regex':
      'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.',
    'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères.',
  }
}
