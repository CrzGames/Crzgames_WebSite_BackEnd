import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de connexion
 */
export const signInValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  }),
)
