import vine from '@vinejs/vine'

export const deleteUsersValidator = vine.compile(
  vine.object({
    id: vine.number().exists({ table: 'users', column: 'id' }),
  }),
)
