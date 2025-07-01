import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de suppression d'un binaire de jeu
 */
export const deleteGameBinariesValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'game_binaries', column: 'id' }),
    }),
  }),
)
