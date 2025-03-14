import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  BelongsTo,
  belongsTo,
  column,
  hasMany,
  HasMany,
  ModelObject,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import UserRole from 'App/Models/UserRole'
import ChatMessage from 'App/Models/ChatMessage'
import ChatFriendRequest from 'App/Models/ChatFriendRequest'
import ChatFriend from 'App/Models/ChatFriend'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public currency_code: string | null

  @column()
  public ip_address: string | null

  @column()
  public ip_region: string | null

  // Relations pour les amis que l'utilisateur a ajoutés
  @hasMany(() => ChatFriend, {
    foreignKey: 'users_id',
  })
  public addedFriends: HasMany<typeof ChatFriend>

  // Relations pour les amis qui ont ajouté l'utilisateur
  @hasMany(() => ChatFriend, {
    foreignKey: 'friend_users_id',
  })
  public addedByFriends: HasMany<typeof ChatFriend>

  @hasMany(() => ChatMessage, {
    foreignKey: 'sender_users_id',
  })
  public sentChatMessage: HasMany<typeof ChatMessage>

  @hasMany(() => ChatMessage, {
    foreignKey: 'receiver_users_id',
  })
  public receivedChatMessages: HasMany<typeof ChatMessage>

  @hasMany(() => ChatFriendRequest, {
    foreignKey: 'sender_users_id',
  })
  public sentChatFriendRequests: HasMany<typeof ChatFriendRequest>

  @hasMany(() => ChatFriendRequest, {
    foreignKey: 'receiver_users_id',
  })
  public receivedChatFriendRequests: HasMany<typeof ChatFriendRequest>

  @column()
  public roles_id: number

  @belongsTo(() => UserRole, {
    foreignKey: 'roles_id',
  })
  public userRole: BelongsTo<typeof UserRole>

  @column()
  public is_active: boolean

  @column()
  public active_code: number

  @column()
  public stripe_customer_id: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User): Promise<void> {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      is_active: !!serialized.is_active,
    } as ModelObject
  }
}
