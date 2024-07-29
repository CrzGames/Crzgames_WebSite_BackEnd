import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetAllGameChangeLogByGameIdValidator {
  constructor(protected ctx: HttpContextContract) {}

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
