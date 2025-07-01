import vine from '@vinejs/vine'

/**
 * Règle personnalisée pour valider le mot de passe avec une expression régulière
 */
const strongPassword = vine.createRule((value, _options, field) => {
  if (typeof value !== 'string') return
  const regex: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/
  if (!regex.test(value)) {
    field.report(
      'The password must contain at least one uppercase letter, one number, and one special character',
      'strongPassword',
      field,
    )
  }
})

/**
 * Validateur pour l'action de réinitialisation du mot de passe
 */
export const resetPasswordValidator = vine.compile(
  vine.object({
    token: vine.string().trim().exists({ table: 'password_reset_tokens', column: 'token' }),
    newPassword: vine.string().minLength(8).confirmed().use(strongPassword()),
  }),
)
