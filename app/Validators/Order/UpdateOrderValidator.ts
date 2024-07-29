import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateOrderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    currency: schema.string.optional(),
    status_order: schema.enum.optional(['Paid', 'Canceled', 'Failed'] as const),
  })

  public messages = {
    'status_order.enum': 'Order status must be one of: pending, completed, cancelled',
  }
}
