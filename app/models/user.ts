import { belongsTo } from '@adonisjs/lucid/orm'
import UserRole from '#models/user_role'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import hash from '@adonisjs/core/services/hash'

import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import env from '#start/env'

import { compose } from '@adonisjs/core/helpers'
import { ModelObject } from '@adonisjs/lucid/types/model'

import { UserSchema } from '#database/schema'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  /**
   * Rôle de l'utilisateur (relation avec UserRole)
   * @type {BelongsTo<typeof UserRole>}
   */
  @belongsTo(() => UserRole, {
    foreignKey: 'rolesId',
  })
  declare public userRole: BelongsTo<typeof UserRole>

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

  /**
   * The currently authenticated access token for the user.
   * This property is set when the user is authenticated using an access token.
   */
  declare public currentAccessToken?: AccessToken
}
