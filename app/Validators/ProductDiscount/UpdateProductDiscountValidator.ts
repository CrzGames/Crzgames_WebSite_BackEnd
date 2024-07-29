import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateProductDiscountValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    products_id: schema.number([
      rules.exists({ table: 'products', column: 'id' }),
      rules.required(),
    ]),
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
