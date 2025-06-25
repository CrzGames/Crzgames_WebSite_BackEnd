import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'
import { CustomMessages } from '@adonisjs/validator/types'

export default class GetAllGameCategoryAssignmentByGameIdValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    gameId: schema.number([rules.required(), rules.exists({ table: 'game_category_assignments', column: 'games_id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages: CustomMessages = {
    'gameId.required': 'Game ID is required',
    'gameId.number': 'Game ID should be a number',
    'gameId.exists': 'Game with this ID does not exist',
  }
}
