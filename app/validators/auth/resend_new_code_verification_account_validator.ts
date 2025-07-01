import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de renvoi de code de vérification
 */
export const resendNewCodeVerificationAccountValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().exists({ table: 'users', column: 'email' }),
  }),
)
