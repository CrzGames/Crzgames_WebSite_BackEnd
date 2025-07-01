import vine from '@vinejs/vine'

export const updateProductDiscountValidator = vine.compile(
  vine.object({
    products_id: vine.number().exists({ table: 'products', column: 'id' }),
    currency: vine.string().maxLength(3),
    discount_percent: vine.number().range([0, 100]),
  }),
)
