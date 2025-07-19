import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de mise à jour d'un binaire de jeu
 */
export const updateGameBinaryValidator = vine.compile(
  vine.object({
    gameId: vine.number().exists({ table: 'games', column: 'id' }),
    binary: vine.object({
      pathfilename: vine.string(),
      platformId: vine.number(),
      bucketName: vine.string(),
    }),
  }),
)
