import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetAllTicketsResponsesByTicketIdValidator {
  constructor(protected ctx: HttpContextContract) {}

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
