import vine from '@vinejs/vine'

export const getAllUsersGamesLibrariesByUserIdValidator = vine.compile(
  vine.object({
    userId: vine.number().exists({ table: 'users', column: 'id' }),
  }),
)
