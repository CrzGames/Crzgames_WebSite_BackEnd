import vine from '@vinejs/vine'

export const createPaymentIntentValidator = vine.compile(
  vine.array(
    vine.object({
      products_id: vine.number().exists({ table: 'products', column: 'id' }),
      quantity: vine.number(),
      game_servers_id: vine.number().exists({ table: 'game_servers', column: 'id' }).optional(),
    }),
  ),
)
