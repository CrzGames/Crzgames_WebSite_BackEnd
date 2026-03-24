import encryption from '@adonisjs/core/services/encryption'
import type User from '#models/user'
import PasswordResetToken from '#models/password_reset_token'
import { DateTime } from 'luxon'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import NotFoundException from '#exceptions/not_found_exception'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Service pour gérer les tokens de réinitialisation de mot de passe
 * @class PasswordResetTokenService
 */
export default class PasswordResetTokenService {
  /**
   * Crée un token de réinitialisation de mot de passe pour un utilisateur
   * @param {User} user - L'utilisateur pour lequel le token est créé
   * @returns {Promise<PasswordResetToken>} - Le token de réinitialisation de mot de passe créé
   */
  public static async createPasswordResetToken(user: User): Promise<PasswordResetToken> {
    try {
      // Crypt le token de réinitialisation de mot de passe
      const token: string = this.generateResetPasswordToken(user.email)

      // Créer une date d'expiration pour le token, par rapport à la durée de validité définie dans les variables d'environnement
      const expiresAt: DateTime = DateTime.local().plus({
        minutes: env.get('MAIL_TOKEN_VALID_MINUTES'),
      })

      // Créer le token de réinitialisation de mot de passe dans la base de données
      return await PasswordResetToken.create({
        usersId: user.id,
        token: token,
        expiresAt: expiresAt,
      })
    } catch (error: any) {
      logger.error('Error creating password reset token: ' + error.message)

      throw new InternalServerErrorException('Failed to create password reset token')
    }
  }

  /**
   * Supprime un token de réinitialisation de mot de passe par son ID
   * @param {number} id - L'ID du token à supprimer
   * @returns {Promise<void>} - Une promesse qui se résout lorsque le token est supprimé
   */
  public static async deletePasswordResetToken(id: number): Promise<void> {
    try {
      const passwordResetToken: PasswordResetToken = await PasswordResetToken.findOrFail(id)
      await passwordResetToken.delete()
    } catch (error: any) {
      logger.error('Error deleting password reset token: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Password reset token not found with ID: ' + id)
      }

      throw new InternalServerErrorException('Failed to delete password reset token')
    }
  }

  /**
   * Récupère un token de réinitialisation de mot de passe par l'ID de l'utilisateur
   * @param {number} userId - L'ID de l'utilisateur pour lequel le token est récupéré
   * @returns {Promise<PasswordResetToken>} - Le token de réinitialisation de mot de passe associé à l'utilisateur
   */
  public static async getPasswordResetTokenByUserId(userId: number): Promise<PasswordResetToken | null> {
    try {
      return await PasswordResetToken.findBy('usersId', userId)
    } catch (error: any) {
      logger.error('Error getting password reset token by userId: ' + error.message)

      throw new InternalServerErrorException('Failed to retrieve password reset token')
    }
  }

  /**
   * Récupère un token de réinitialisation de mot de passe par le token lui-même
   * @param {string} token - Le token de réinitialisation de mot de passe à rechercher
   * @returns {Promise<PasswordResetToken>} - Le token de réinitialisation de mot de passe trouvé
   */
  public static async getPasswordResetTokenByToken(token: string): Promise<PasswordResetToken> {
    try {
      return await PasswordResetToken.findByOrFail('token', token)
    } catch (error: any) {
      logger.error('Error getting password reset token by token: ' + error.message)

      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Password reset token not found for token: ' + token)
      }

      throw new InternalServerErrorException('Failed to retrieve password reset token')
    }
  }

  /**
   * Génère un token de réinitialisation de mot de passe crypté à partir de l'email de l'utilisateur
   * @param {string} email - L'email de l'utilisateur pour lequel le token de réinitialisation est généré
   * @returns {string} - Le token de réinitialisation de mot de passe crypté
   */
  public static generateResetPasswordToken(email: string): string {
    try {
      return encryption.encrypt(email)
    } catch (error: any) {
      logger.error('Error generating reset password token: ' + error.message)
      throw new InternalServerErrorException('Failed to generate reset password token')
    }
  }

  /**
   * Décrypte un token de réinitialisation de mot de passe pour récupérer l'email de l'utilisateur
   * @param {string} token - Le token de réinitialisation de mot de passe à décrypter
   * @returns {string | null} - L'email de l'utilisateur si le token est valide, sinon null
   */
  public static decryptResetPasswordToken(token: string): string | null {
    try {
      return encryption.decrypt(token)
    } catch (error: any) {
      logger.error('Error decrypting reset password token: ' + error.message)
      throw new InternalServerErrorException('Failed to decrypt reset password token')
    }
  }
}
