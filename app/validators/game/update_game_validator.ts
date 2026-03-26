import vine from '@vinejs/vine'

/**
 * Validateur pour l'action de mise à jour d'un jeu
 */
const gameModeValues = ['solo', 'multiplayer', 'both'] as const
const pegiRatingValues = ['PEGI 3', 'PEGI 7', 'PEGI 12', 'PEGI 16', 'PEGI 18'] as const
const gameMediaTypes = ['screenshot', 'trailer', 'gameplay'] as const

const gameConfigurationSchema = vine.object({
  cpuIntel: vine.string().trim(),
  cpuAmd: vine.string().trim(),
  gpuNvidia: vine.string().trim(),
  gpuAmd: vine.string().trim(),
  ram: vine.string().trim(),
  storage: vine.string().trim(),
  os: vine.string().trim(),
  internet: vine.boolean().nullable().optional(),
  additionalNotes: vine.string().nullable().optional(),
})

export const updateGameValidator = vine.compile(
  vine.object({
    title: vine.string(),
    gameMode: vine.enum(gameModeValues),
    publisher: vine.string().trim(),
    developer: vine.string().trim(),
    pegiRating: vine.enum(pegiRatingValues),
    releaseDate: vine.string().nullable().optional(),
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
    languageIds: vine.array(vine.number()),
    gameConfigurationsMinimal: gameConfigurationSchema,
    gameConfigurationsRecommended: gameConfigurationSchema,
    gameMedias: vine
      .array(
        vine.object({
          pathFilename: vine.string(),
          bucketName: vine.string(),
          type: vine.enum(gameMediaTypes),
        }),
      )
      .optional(),
    binaries: vine
      .array(
        vine.object({
          pathfilename: vine.string(),
          platformId: vine.number(),
          bucketName: vine.string(),
        }),
      )
      .optional(),
  }),
)
