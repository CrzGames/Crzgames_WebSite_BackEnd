import vine from '@vinejs/vine'

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim(),
    games_id: vine.number().exists({ table: 'games', column: 'id' }),
    price: vine.number(),
    product_categories_id: vine.number(),
    bucket_name: vine.string().trim(),
    pathFilename: vine.string().trim(),
    image_files_id: vine.number(),
  }),
)
