import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateOrderValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    users_id: schema.number([rules.exists({ table: 'users', column: 'id' }), rules.required()]),
    currency: schema.string({}, [rules.required()]),
    status_order: schema.enum(['Paid', 'Canceled', 'Failed'] as const, [rules.required()]),
  })

  public messages = {
    'users_id.required': 'User ID is required',
    'users_id.exists': 'User does not exist',
    'currency.required': 'Currency is required and must be a valid ISO currency code',
    'status_order.required': 'Order status is required',
    'status_order.enum': 'Order status must be one of: pending, completed, cancelled',
  }
}
