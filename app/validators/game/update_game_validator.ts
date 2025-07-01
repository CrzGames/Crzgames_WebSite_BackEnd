import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de mise à jour d'un jeu
 */
export const updateGameValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().exists({ table: 'games', column: 'id' }),
    }),
    title: vine.string(),
    upcomingGame: vine.boolean(),
    newGame: vine.boolean(),
    description: vine.string(),
    trailerFilesId: vine.number(),
    logoFilesId: vine.number(),
    pictureFileId: vine.number(),
    trailerPathFilename: vine.string(),
    trailerBucketName: vine.string(),
    picturePathFilename: vine.string(),
    pictureBucketName: vine.string(),
    logoPathFilename: vine.string(),
    logoBucketName: vine.string(),
    categoryIds: vine.array(vine.number()),
    platformIds: vine.array(vine.number()),
    binaries: vine.array(
      vine.object({
        pathfilename: vine.string(),
        platformId: vine.number(),
        bucketName: vine.string(),
      }),
    ),
  }),
)
