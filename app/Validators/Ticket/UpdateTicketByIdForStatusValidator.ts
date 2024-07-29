import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UpdateTicketByIdForStatusValidator {
  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.required()]),
  })

  public messages = {
    'name.required': 'The ticket status name is required.',
  }
}
