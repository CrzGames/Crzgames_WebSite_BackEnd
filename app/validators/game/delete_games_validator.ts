import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de suppression de jeux
 */
export const deleteGamesValidator = vine.compile(
  vine.object({
    id: vine.number().exists({ table: 'games', column: 'id' }),
  }),
)
