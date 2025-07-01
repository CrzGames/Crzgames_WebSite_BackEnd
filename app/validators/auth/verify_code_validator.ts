import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de vérification de code
 */
export const verifyCodeValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().exists({ table: 'users', column: 'email' }),
    code: vine.number(),
  }),
)
