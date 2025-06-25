import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class CreateProductDiscountValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    products_id: schema.number([rules.exists({ table: 'products', column: 'id' }), rules.required()]),
    currency: schema.string({}, [rules.required(), rules.maxLength(3)]),
    discount_percent: schema.number([rules.required(), rules.range(0, 100)]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    'products_id.exists': 'The specified product does not exist',
    'currency.maxLength': 'Currency code must be exactly 3 characters long',
    'discount_percent.range': 'The discount percent must be between 0 and 100',
  }
}
