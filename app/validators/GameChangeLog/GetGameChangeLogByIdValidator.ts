import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération d'un journal de modifications par ID
 */
export const getGameChangeLogByIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'game_change_logs', column: 'id' }),
    }),
  }),
)
