import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import hash from '@adonisjs/core/services/hash'
import UserRole from '#models/user_role'
import ChatMessage from '#models/chat_message'
import ChatFriendRequest from '#models/chat_friend_request'
import ChatFriend from '#models/chat_friend'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
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
 * The User model represents a user of the Crzgames application
 * @interface
 */
export default class User extends compose(BaseModel, AuthFinder) {
  /**
   * Identifiant unique de l'utilisateur
   * @type {number}
   */
  @column({ isPrimary: true })
  declare public id: number

  /**
   * Nom d'utilisateur (requis lors de l'inscription, minimum 3 caractères)
   * @type {string}
   */
  @column()
  // @props({ minLength: 3 })
  // @example('johndoe')
  declare public username: string

  /**
   * Adresse email de l'utilisateur (requis lors de l'inscription, format email)
   * @type {string}
   */
  @column()
  // @format('email')
  // @example('johndoe@example.com')
  declare public email: string

  /**
   * Mot de passe de l'utilisateur (requis lors de l'inscription, masqué dans Swagger)
   * @type {string}
   */
  @column({ serializeAs: null })
  // @no-swagger
  declare public password: string

  /**
   * Code de devise de l'utilisateur (optionnel, USD, EUR, GBP)
   * @type {string | null}
   */
  @column()
  // @enum(Object.values(CurrencyCode))
  declare public currency_code: string | null

  /**
   * Adresse IP de l'utilisateur (optionnel)
   * @type {string | null}
   */
  @column()
  declare public ip_address: string | null

  /**
   * Région déduite de l'adresse IP (optionnel)
   * @type {string | null}
   */
  @column()
  declare public ip_region: string | null

  /**
   * Relations pour les amis que l'utilisateur a ajoutés
   * @type {HasMany<typeof ChatFriend>}
   */
  @hasMany(() => ChatFriend, {
    foreignKey: 'users_id',
  })
  // @no-swagger
  declare public addedFriends: HasMany<typeof ChatFriend>

  /**
   * Relations pour les amis qui ont ajouté l'utilisateur
   * @type {HasMany<typeof ChatFriend>}
   */
  @hasMany(() => ChatFriend, {
    foreignKey: 'friend_users_id',
  })
  // @no-swagger
  declare public addedByFriends: HasMany<typeof ChatFriend>

  /**
   * Messages envoyés par l'utilisateur
   * @type {HasMany<typeof ChatMessage>}
   */
  @hasMany(() => ChatMessage, {
    foreignKey: 'sender_users_id',
  })
  // @no-swagger
  declare public sentChatMessage: HasMany<typeof ChatMessage>

  /**
   * Messages reçus par l'utilisateur
   * @type {HasMany<typeof ChatMessage>}
   */
  @hasMany(() => ChatMessage, {
    foreignKey: 'receiver_users_id',
  })
  // @no-swagger
  declare public receivedChatMessages: HasMany<typeof ChatMessage>

  /**
   * Demandes d'amis envoyées par l'utilisateur
   * @type {HasMany<typeof ChatFriendRequest>}
   */
  @hasMany(() => ChatFriendRequest, {
    foreignKey: 'sender_users_id',
  })
  // @no-swagger
  declare public sentChatFriendRequests: HasMany<typeof ChatFriendRequest>

  /**
   * Demandes d'amis reçues par l'utilisateur
   * @type {HasMany<typeof ChatFriendRequest>}
   */
  @hasMany(() => ChatFriendRequest, {
    foreignKey: 'receiver_users_id',
  })
  // @no-swagger
  declare public receivedChatFriendRequests: HasMany<typeof ChatFriendRequest>

  /**
   * Identifiant du rôle de l'utilisateur (requis lors de l'inscription, lié à la table user_roles)
   * @type {number}
   */
  @column()
  // @enum(Object.values(UserRoles))
  declare public roles_id: number

  /**
   * Rôle de l'utilisateur (relation avec UserRole)
   * @type {BelongsTo<typeof UserRole>}
   */
  @belongsTo(() => UserRole, {
    foreignKey: 'roles_id',
  })
  // @no-swagger
  declare public userRole: BelongsTo<typeof UserRole>

  /**
   * Indique si le compte est activé (défini automatiquement)
   * @type {boolean}
   */
  @column()
  declare public is_active: boolean

  /**
   * Code d'activation pour vérifier le compte (généré automatiquement)
   * @type {number}
   */
  @column()
  // @props({ minimum: 100000, maximum: 999999 })
  declare public active_code: number

  /**
   * Identifiant du client Stripe (optionnel)
   * @type {string | null}
   */
  @column()
  declare public stripe_customer_id: string | null

  /**
   * Date de création de l'utilisateur
   * @type {DateTime}
   */
  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  /**
   * Date de mise à jour de l'utilisateur
   * @type {DateTime}
   */
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
