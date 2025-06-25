import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class GetAllGameChangeLogByGameIdValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    title: schema.string([rules.required(), rules.exists({ table: 'games', column: 'title' })]),
  })

  public get data() {
    this.ctx.params.title = decodeURIComponent(this.ctx.params.title)
    return this.ctx.params
  }

  public messages = {
    'title.required': 'title is required',
  }
}
