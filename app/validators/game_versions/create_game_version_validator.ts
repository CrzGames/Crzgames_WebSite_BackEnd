import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de création d'une version de jeu
 */
export const createGameVersionValidator = vine.compile(
  vine.object({
    version: vine.string(),
    is_available: vine.boolean(),
  }),
)
