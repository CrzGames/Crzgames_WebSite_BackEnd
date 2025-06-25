import { schema, rules } from '@adonisjs/validator'
import { HttpContext } from '@adonisjs/core/http'

export default class UpdateCarouselValidator {
  constructor(protected ctx: HttpContext) {}

  public schema = schema.create({
    title: schema.string.optional(),
    content: schema.string.optional(),
    button_url: schema.string.optional(),
    button_content: schema.string.optional(),
    imagePathFilename: schema.string([rules.required()]),
    imageBucketName: schema.string([rules.required()]),
    logoPathFilename: schema.string.optional(),
    logoBucketName: schema.string.optional(),
    imageFilesId: schema.number([rules.required()]),
  })

  public messages = {}
}
