import vine from '@vinejs/vine'

export const createUsersGamesLibrariesValidator = vine.compile(
  vine.object({
    userId: vine.number().exists({ table: 'users', column: 'id' }),
    gameId: vine.number().exists({ table: 'games', column: 'id' }),
  }),
)
