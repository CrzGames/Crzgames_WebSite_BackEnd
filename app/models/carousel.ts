import { belongsTo } from '@adonisjs/lucid/orm'
import File from '#models/file'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { CarouselSchema } from '#database/schema'

export default class Carousel extends CarouselSchema {
  @belongsTo(() => File, {
    foreignKey: 'image_files_id',
  })
  declare public imageFile: BelongsTo<typeof File>

  @belongsTo(() => File, {
    foreignKey: 'logo_files_id',
  })
  declare public logoFile: BelongsTo<typeof File>
}
