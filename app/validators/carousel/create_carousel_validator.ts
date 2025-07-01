import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de création d'un carrousel
 */
export const createCarouselValidator = vine.compile(
  vine.object({
    title: vine.string().optional(),
    content: vine.string().optional(),
    button_url: vine.string().optional(),
    button_content: vine.string().optional(),
    imagePathFilename: vine.string(),
    imageBucketName: vine.string(),
    logoPathFilename: vine.string().optional(),
    logoBucketName: vine.string().optional(),
  }),
)
