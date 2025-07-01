import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération des assignations de plateformes par ID de jeu
 */
export const getAllGamePlatformAssignmentByGameIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      gameId: vine.number().exists({ table: 'game_platform_assignments', column: 'games_id' }),
    }),
  }),
)
