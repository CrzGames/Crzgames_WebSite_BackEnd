import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateGameValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number([rules.required(), rules.exists({ table: 'games', column: 'id' })]),
    title: schema.string([rules.required()]),
    upcomingGame: schema.boolean(),
    newGame: schema.boolean(),
    description: schema.string([rules.required()]),
    trailerFilesId: schema.number([rules.required()]),
    logoFilesId: schema.number([rules.required()]),
    pictureFileId: schema.number([rules.required()]),
    trailerPathFilename: schema.string([rules.required()]),
    trailerBucketName: schema.string([rules.required()]),
    picturePathFilename: schema.string([rules.required()]),
    pictureBucketName: schema.string([rules.required()]),
    logoPathFilename: schema.string([rules.required()]),
    logoBucketName: schema.string([rules.required()]),
    categoryIds: schema.array([rules.required()]).members(schema.number([rules.required()])),
    platformIds: schema.array([rules.required()]).members(schema.number([rules.required()])),
    binaries: schema.array([rules.required()]).members(
      schema.object([rules.required()]).members({
        pathfilename: schema.string([rules.required()]),
        platformId: schema.number([rules.required()]),
        bucketName: schema.string([rules.required()]),
      }),
    ),
  })

  public messages: CustomMessages = {
    'id.required': 'Game ID is required',
    'id.exists': 'Game does not exist',
    'title.required': 'Le titre est requis.',
    'price.required': 'Le prix est requis.',
    'price.number': 'Le prix doit être un nombre.',
    'requirementSystemMinimal.required': 'Le système minimal est requis.',
    'requirementSystemRecommended.required': 'Le système recommandé est requis.',
    'gameTrailer.required': 'Le trailer du jeu est requis.',
    'gamePicture.required': "L'image du jeu est requise.",
    'gameLogo.required': 'Le logo du jeu est requis.',
    'categoryIds.required': 'Au moins une catégorie est requise.',
    'categoryIds.array': 'Les catégories doivent être une liste.',
    'categoryIds.*.number': 'Chaque ID de catégorie doit être un nombre.',
    'platformIds.required': 'Au moins une plateforme est requise.',
    'platformIds.array': 'Les plateformes doivent être une liste.',
    'platformIds.*.number': 'Chaque ID de plateforme doit être un nombre.',
    'binaries.required': 'Au moins un binaire est requis.',
    'binaries.array': 'Les binaires doivent être une liste.',
    'binaries.*.path.required': 'Le chemin du binaire est requis.',
    'binaries.*.platformId.required': "L'ID de la plateforme est requis.",
    'binaries.*.platformId.number': "L'ID de la plateforme doit être un nombre.",
  }
}
