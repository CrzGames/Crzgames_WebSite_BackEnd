import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class CreateUsersGamesLibrariesValidator {
  constructor(protected ctx: HttpContext) {}

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
