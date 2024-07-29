import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUsersGamesLibrariesValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    userId: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
    gameId: schema.number([rules.required(), rules.exists({ table: 'games', column: 'id' })]),
  })

  public messages = {
    'userId.required': 'User ID is required',
    'userId.exists': 'User does not exist',
    'gameId.required': 'Game ID is required',
    'gameId.exists': 'Game does not exist',
  }
}
