import { belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { PasswordResetTokenSchema } from '#database/schema'

export default class PasswordResetToken extends PasswordResetTokenSchema {
  @belongsTo(() => User)
  declare public user: BelongsTo<typeof User>
}
