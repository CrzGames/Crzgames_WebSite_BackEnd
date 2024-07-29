import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUsersValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
    username: schema.string.optional({ trim: true }, [
      rules.unique({ table: 'users', column: 'username' }),
      rules.minLength(4),
      rules.maxLength(22),
    ]),
    // include other fields to be updated with their validation rules
  })

  // public get data() {
  //   return this.ctx.params
  // }

  public messages = {
    'id.required': 'User ID is required',
    'id.exists': 'User does not exist',
    // include other field validation messages
  }
}
