import { schema, rules } from '@adonisjs/validator'
import type { HttpContext } from '@adonisjs/core/http'
import { CustomMessages } from '@adonisjs/validator/types'

export default class CreateGameBinaryValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    gameId: schema.number([rules.required(), rules.exists({ table: 'games', column: 'id' })]),
    binary: schema.object([rules.required()]).members({
      pathfilename: schema.string([rules.required()]),
      platformId: schema.number([rules.required()]),
      bucketName: schema.string([rules.required()]),
    }),
  })

  public messages: CustomMessages = {
    'gameId.required': 'Game ID is required',
    'gameId.exists': 'Game does not exist',
    'binary.required': 'Binary is required',
    'binary.pathfilename.required': 'Binary pathfilename is required',
    'binary.platformId.required': 'Binary platformId is required',
    'binary.platformId.number': 'Binary platformId must be a number',
    'binary.bucketName.required': 'Binary bucketName is required',
  }
}
