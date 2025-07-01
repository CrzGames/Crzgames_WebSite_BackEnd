import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de réinitialisation de l'email
 */
export const resetEmailValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
    newEmail: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value, _field) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
  }),
)
