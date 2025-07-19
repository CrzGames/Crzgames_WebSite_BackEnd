import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération des assignations de catégories par ID de catégorie
 */
export const getAllGameCategoryAssignmentByCategoryIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      categoryId: vine.number().exists({ table: 'game_category_assignments', column: 'game_categories_id' }),
    }),
  }),
)
