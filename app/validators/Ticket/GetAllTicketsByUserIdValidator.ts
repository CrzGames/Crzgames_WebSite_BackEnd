import vine from '@vinejs/vine'

export const getAllTicketsByUserIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      userId: vine.number().exists({ table: 'users', column: 'id' }),
    }),
  }),
)
