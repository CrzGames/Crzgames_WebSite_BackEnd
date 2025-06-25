import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class GetTicketsByIdValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    id: schema.number([rules.required(), rules.exists({ table: 'tickets', column: 'id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'id.required': 'Ticket ID is required',
    'id.exists': 'Ticket does not exist',
  }
}
