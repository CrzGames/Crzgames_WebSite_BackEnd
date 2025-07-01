import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de récupération d'un binaire de jeu par ID
 */
export const getGameBinariesByIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'game_binaries', column: 'id' }),
    }),
  }),
)
