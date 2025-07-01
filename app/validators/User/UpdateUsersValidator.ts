import vine from '@vinejs/vine'

export const updateUsersValidator = vine.compile(
  vine.object({
    id: vine.number().exists({ table: 'users', column: 'id' }),
    username: vine.string().trim().minLength(4).maxLength(22).unique({ table: 'users', column: 'username' }).optional(),
  }),
)
