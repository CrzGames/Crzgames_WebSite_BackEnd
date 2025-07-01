import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de création d'un jeu
 */
export const createGameValidator = vine.compile(
  vine.object({
    title: vine.string(),
    upcomingGame: vine.boolean(),
    newGame: vine.boolean(),
    description: vine.string(),
    trailerPathFilename: vine.string(),
    trailerBucketName: vine.string(),
    picturePathFilename: vine.string(),
    pictureBucketName: vine.string(),
    logoPathFilename: vine.string(),
    logoBucketName: vine.string(),
    categoryIds: vine.array(vine.number()),
    platformIds: vine.array(vine.number()),
  }),
)
