import vine from '@vinejs/vine'

/**
 * Règle personnalisée pour valider le mot de passe avec une expression régulière
 */
const strongPassword = vine.createRule((value, _options, field) => {
  if (typeof value !== 'string') return
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])[A-Za-z\d\S]{8,}$/
  if (!regex.test(value)) {
    field.report(
      'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.',
      'strongPassword',
      field,
    )
  }
})

/**
 * Validateur pour l'action d'inscription
 */
export const signUpValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .minLength(4)
      .maxLength(22)
      .unique(async (db, value, _field) => {
        const user = await db.from('users').where('username', value).first()
        return !user
      }),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value, _field) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(8).confirmed().use(strongPassword()),
    ip_address: vine.string(),
    currency_code: vine.string(),
  }),
)
