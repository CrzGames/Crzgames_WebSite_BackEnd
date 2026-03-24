import vine from '@vinejs/vine'

export const getTicketsByIdValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'tickets', column: 'id' }),
    }),
  }),
)
