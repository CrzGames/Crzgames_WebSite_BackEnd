import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de suppression d'un journal de modifications de jeu
 */
export const deleteGameChangeLogValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'game_change_logs', column: 'id' }),
    }),
  }),
)
