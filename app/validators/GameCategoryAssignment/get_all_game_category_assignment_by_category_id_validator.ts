import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'
import { CustomMessages } from '@adonisjs/validator/types'

export default class GetAllGameCategoryAssignmentByCategoryIdValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    categoryId: schema.number([
      rules.required(),
      rules.exists({ table: 'game_category_assignments', column: 'game_categories_id' }),
    ]),
  })

  public get data() {
    return this.ctx.params
  }

  public messages: CustomMessages = {
    'categoryId.required': 'Category ID is required',
    'categoryId.number': 'Category ID should be a number',
    'categoryId.exists': 'Category with this ID does not exist',
  }
}
