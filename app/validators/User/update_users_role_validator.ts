import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class UpdateUsersRoleValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    userId: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
    roleId: schema.number([rules.required(), rules.exists({ table: 'user_roles', column: 'id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'userId.required': 'User ID is required',
    'userId.exists': 'User does not exist',
    'roleId.required': 'Role ID is required',
    'roleId.exists': 'Role does not exist',
  }
}
