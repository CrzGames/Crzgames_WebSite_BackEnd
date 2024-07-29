import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetAllUsersGamesLibrariesByUserIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userId: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'userId.required': 'User ID is required',
    'userId.exists': 'User does not exist',
  }
}
