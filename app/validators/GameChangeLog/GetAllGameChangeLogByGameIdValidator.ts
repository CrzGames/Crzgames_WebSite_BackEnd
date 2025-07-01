import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération des journaux de modifications par ID de jeu
 */
export const getAllGameChangeLogByGameIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      gameId: vine.number().exists({ table: 'game_change_logs', column: 'games_id' }),
    }),
  }),
)
