import vine from '@vinejs/vine'

export const createTicketResponsesValidator = vine.compile(
  vine.object({
    content: vine.string(),
    userId: vine.number().exists({ table: 'users', column: 'id' }),
    ticketId: vine.number().exists({ table: 'tickets', column: 'id' }),
  }),
)
