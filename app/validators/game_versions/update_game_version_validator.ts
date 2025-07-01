import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de mise à jour d'une version de jeu
 */
export const updateGameVersionValidator = vine.compile(
  vine.object({
    is_available: vine.boolean(),
  }),
)
