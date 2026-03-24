import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération d'un jeu par ID
 */
export const getGamesByIdValidator = vine.compile(
  vine.object({
    id: vine.number().exists({ table: 'games', column: 'id' }),
  }),
)
