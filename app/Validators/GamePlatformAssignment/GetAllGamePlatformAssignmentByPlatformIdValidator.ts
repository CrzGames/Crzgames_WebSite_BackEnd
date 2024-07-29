import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetAllGamePlatformAssignmentByPlatformIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    platformId: schema.number([
      rules.required(),
      rules.exists({ table: 'game_platform_assignments', column: 'game_platforms_id' }),
    ]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'platformId.required': 'Platform ID is required',
    'platformId.number': 'Platform ID should be a number',
    'platformId.exists': 'No game assignments for the platform with this ID exist',
  }
}
