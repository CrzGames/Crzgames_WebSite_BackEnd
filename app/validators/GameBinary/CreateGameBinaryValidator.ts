import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de création d'un binaire de jeu
 */
export const createGameBinaryValidator = vine.compile(
  vine.object({
    gameId: vine.number().exists({ table: 'games', column: 'id' }),
    binary: vine.object({
      pathfilename: vine.string(),
      platformId: vine.number(),
      bucketName: vine.string(),
    }),
  }),
)
