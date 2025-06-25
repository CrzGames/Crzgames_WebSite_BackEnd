import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import UserRole from '#models/user_role'
import ChatMessage from '#models/chat_message'
import ChatFriendRequest from '#models/chat_friend_request'
import ChatFriend from '#models/chat_friend'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { Hash } from '@adonisjs/core/hash'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import env from '#start/env'
import { compose } from '@adonisjs/core/helpers'

/**
 * Fonction de mixin pour la gestion de l'authentification.
 * Doc : https://docs.adonisjs.com/guides/authentication/verifying-user-credentials
 */
const AuthFinder: ReturnType<typeof withAuthFinder> = withAuthFinder((): Hash => hash.use(), {
  uids: ['email'],
  passwordColumnName: 'password',
})

/**
 * The User model represents a user of the application.
 */
export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public username: string

  @column()
  declare public email: string

  @column({ serializeAs: null })
  declare public password: string

  @column()
  declare public currency_code: string | null

  @column()
  declare public ip_address: string | null

  @column()
  declare public ip_region: string | null

  // Relations pour les amis que l'utilisateur a ajoutés
  @hasMany(() => ChatFriend, {
    foreignKey: 'users_id',
  })
  declare public addedFriends: HasMany<typeof ChatFriend>

  // Relations pour les amis qui ont ajouté l'utilisateur
  @hasMany(() => ChatFriend, {
    foreignKey: 'friend_users_id',
  })
  declare public addedByFriends: HasMany<typeof ChatFriend>

  @hasMany(() => ChatMessage, {
    foreignKey: 'sender_users_id',
  })
  declare public sentChatMessage: HasMany<typeof ChatMessage>

  @hasMany(() => ChatMessage, {
    foreignKey: 'receiver_users_id',
  })
  declare public receivedChatMessages: HasMany<typeof ChatMessage>

  @hasMany(() => ChatFriendRequest, {
    foreignKey: 'sender_users_id',
  })
  declare public sentChatFriendRequests: HasMany<typeof ChatFriendRequest>

  @hasMany(() => ChatFriendRequest, {
    foreignKey: 'receiver_users_id',
  })
  declare public receivedChatFriendRequests: HasMany<typeof ChatFriendRequest>

  @column()
  declare public roles_id: number

  @belongsTo(() => UserRole, {
    foreignKey: 'roles_id',
  })
  declare public userRole: BelongsTo<typeof UserRole>

  @column()
  declare public is_active: boolean

  @column()
  declare public active_code: number

  @column()
  declare public stripe_customer_id: string | null

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  /**
   * Surcharge de la sérialisation pour convertir les champs en booléens explicites
   * lors de la sérialisation en JSON de la response
   * @returns {ModelObject} - L'objet sérialisé avec les champs booléens
   */
  public serialize(): ModelObject {
    const serialized: ModelObject = super.serialize()

    return {
      ...serialized,
      is_active: !!serialized.is_active,
    } as ModelObject
  }

  /**
   * The access token provider for the user model.
   * This provider is used to generate and validate access tokens for the user.
   */
  public static accessTokens: DbAccessTokensProvider<typeof User> = DbAccessTokensProvider.forModel(User, {
    expiresIn: env.get('API_USER_TOKEN_EXPIRATION'),
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: env.get('API_USER_TOKEN_SECRET_LENGTH'),
  })
}
