import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération des assignations de catégories par ID de jeu
 */
export const getAllGameCategoryAssignmentByGameIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      gameId: vine.number().exists({ table: 'game_category_assignments', column: 'games_id' }),
    }),
  }),
)
