import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de création d'un journal de modifications de jeu
 */
export const createGameChangeLogValidator = vine.compile(
  vine.object({
    games_id: vine.number().exists({ table: 'games', column: 'id' }),
    version: vine.string(),
    content: vine.string(),
  }),
)
