import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class UpdateOrderValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    currency: schema.string.optional(),
    status_order: schema.enum.optional(['Paid', 'Canceled', 'Failed'] as const),
  })

  public messages = {
    'status_order.enum': 'Order status must be one of: pending, completed, cancelled',
  }
}
