import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de réinitialisation du mot de passe
 */
export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().exists({ table: 'users', column: 'email' }),
  }),
)
