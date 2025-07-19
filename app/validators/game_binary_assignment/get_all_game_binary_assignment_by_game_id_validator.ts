import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération des assignations de binaires par ID de jeu
 */
export const getAllGameBinaryAssignmentByGameIdValidator = vine.compile(
  vine.object({
    gameId: vine.number().exists({ table: 'game_binary_assignments', column: 'games_id' }),
  }),
)
