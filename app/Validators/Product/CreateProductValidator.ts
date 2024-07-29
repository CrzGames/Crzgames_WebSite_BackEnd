import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateProductValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.maxLength(255), rules.required()]),
    description: schema.string({ trim: true }, [rules.required()]),
    games_id: schema.number([rules.exists({ table: 'games', column: 'id' }), rules.required()]),
    product_categories_id: schema.number([rules.required()]),
    price: schema.number(),
    bucket_name: schema.string({ trim: true }, [rules.required()]),
    pathFilename: schema.string({ trim: true }, [rules.required()]),
  })

  public messages = {
    required: 'The {{ field }} is required',
    'name.maxLength': 'The name cannot be longer than 255 characters',
    'games_id.exists': 'The specified game does not exist',
    'price.number': 'The price must be a valid number',
    'pathFilename.required': 'The pathFilename is required',
    'bucket_name.required': 'The bucket_name is required',
  }
}
