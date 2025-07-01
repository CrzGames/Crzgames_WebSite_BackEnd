import vine from '@vinejs/vine'

export const getAllTicketsResponsesByTicketIdValidator = vine.compile(
  vine.object({
    ticketId: vine.number().exists({ table: 'tickets', column: 'id' }),
  }),
)
