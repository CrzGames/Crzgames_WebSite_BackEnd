import vine from '@vinejs/vine'

export const createTicketsValidator = vine.compile(
  vine.object({
    subject: vine.string(),
    description: vine.string(),
    statusId: vine.number(),
    categoryId: vine.number().exists({ table: 'ticket_categories', column: 'id' }),
    userId: vine.number().exists({ table: 'users', column: 'id' }),
  }),
)
