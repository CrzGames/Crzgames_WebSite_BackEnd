import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class GetAllTicketsResponsesByTicketIdValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    ticketId: schema.number([rules.required(), rules.exists({ table: 'tickets', column: 'id' })]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages = {
    'ticketId.required': 'Ticket ID is required',
    'ticketId.exists': 'Ticket does not exist',
  }
}
