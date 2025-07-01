import vine from '@vinejs/vine'

export const updateUsersRoleValidator = vine.compile(
  vine.object({
    userId: vine.number().exists({ table: 'users', column: 'id' }),
    roleId: vine.number().exists({ table: 'user_roles', column: 'id' }),
  }),
)
