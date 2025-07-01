import vine from '@vinejs/vine'

/**
 * Validateur pour l'action d'envoi d'un email pour modifier l'email
 */
export const sendMailToModifyEmailValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().exists({ table: 'users', column: 'email' }),
  }),
)
