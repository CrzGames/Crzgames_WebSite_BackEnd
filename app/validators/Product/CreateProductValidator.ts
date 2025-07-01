import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim(),
    games_id: vine.number().exists({ table: 'games', column: 'id' }),
    product_categories_id: vine.number(),
    price: vine.number().optional(),
    bucket_name: vine.string().trim(),
    pathFilename: vine.string().trim(),
  }),
)
