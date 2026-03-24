import { belongsTo } from '@adonisjs/lucid/orm'
import File from '#models/file'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { ModelObject } from '@adonisjs/lucid/types/model'

import { CarouselSchema } from '#database/schema'

export default class Carousel extends CarouselSchema {
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()
    const buttonUrl: string | null = (serialized.buttonUrl ?? serialized.button_url ?? null) as string | null
    const buttonContent: string | null = (serialized.buttonContent ?? serialized.button_content ?? null) as
      | string
      | null
    const imageFilesId: number | null = (serialized.imageFilesId ?? serialized.image_files_id ?? null) as number | null
    const logoFilesId: number | null = (serialized.logoFilesId ?? serialized.logo_files_id ?? null) as number | null
    const createdAt: unknown = serialized.createdAt ?? serialized.created_at ?? null
    const updatedAt: unknown = serialized.updatedAt ?? serialized.updated_at ?? null

    return {
      ...serialized,
      buttonUrl,
      buttonContent,
      imageFilesId,
      logoFilesId,
      createdAt,
      updatedAt,
      button_url: buttonUrl,
      button_content: buttonContent,
      image_files_id: imageFilesId,
      logo_files_id: logoFilesId,
      created_at: createdAt,
      updated_at: updatedAt,
    } as ModelObject
  }

  @belongsTo(() => File, {
    foreignKey: 'imageFilesId',
  })
  declare public imageFile: BelongsTo<typeof File>

  @belongsTo(() => File, {
    foreignKey: 'logoFilesId',
  })
  declare public logoFile: BelongsTo<typeof File>
}
