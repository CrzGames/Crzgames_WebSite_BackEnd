import vine from '@vinejs/vine'

export const getTicketsByIdValidator = vine.compile(
  vine.object({
    id: vine.number().exists({ table: 'tickets', column: 'id' }),
  }),
)
