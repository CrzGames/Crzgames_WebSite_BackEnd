import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import MailService from '#services/mail_service'
import env from '#start/env'
import PasswordResetTokenService from '#services/password_reset_token_service'
import type PasswordResetToken from '#models/password_reset_token'
import { DateTime } from 'luxon'
import { UserRoles } from '#enums/user_roles'
import UserRolesService from '#services/user_roles_service'
import type UserRole from '#models/user_role'
import BadRequestException from '#exceptions/bad_request_exception'
import logger from '@adonisjs/core/services/logger'
import UnauthorizedException from '#exceptions/unauthorized_exception'
import type { AccessToken } from '@adonisjs/auth/access_tokens'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import type {
  ForgotPasswordData,
  ResendNewCodeVerificationAccountData,
  ResetEmailData,
  ResetPasswordData,
  SendMailToModifyEmailData,
  SignInData,
  SignOutData,
  SignUpData,
  VerifyCodeData,
} from '#types/auth_types'
import NotFoundException from '#exceptions/not_found_exception'
import { errors as authErrors } from '@adonisjs/auth'
import { errors as lucidErrors } from '@adonisjs/lucid'

/**
 * Un service pour gérer l'authentification des utilisateurs et les opérations associées.
 * @class AuthService
 */
export default class AuthService {
  /**
   * Méthode pour l'inscription d'un utilisateur
   * @param {SignUpData} data - Les données d'inscription de l'utilisateur
   * @returns {Promise<void>} - Retourne une promesse qui se résout lorsque l'utilisateur est inscrit
   */
  public static async signUp(data: SignUpData): Promise<void> {
    try {
      // Générer un code d'activation aléatoire à 6 chiffres.
      const activeCode: number = Math.floor(100000 + Math.random() * 900000)

      // Récupérer le rôle client depuis le service UserRolesService, pour un utilisateur standard.
      const clientRole: UserRole = await UserRolesService.getUserRoleByName(UserRoles.CLIENT)

      // Créer un nouvel utilisateur avec les données fournies, dans la table 'users'.
      const user: User = await User.create({
        username: data.username,
        email: data.email,
        password: data.password, // Automatiquement haché par le modèle User
        rolesId: clientRole.id,
        currencyCode: data.currency_code,
        ipAddress: data.ip_address,
        ipRegion: null,
        activeCode: activeCode,
      })

      // Envoyer un e-mail de bienvenue à l'utilisateur avec le code d'activation.
      await MailService.sendMail(
        user.email,
        'welcome',
        {
          username: user.username,
          code: user.activeCode,
          redirect_uri:
            env.get('FRONTEND_APP_BASE_URL') + env.get('FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
        },
        'Welcome to CrzGames',
      )
    } catch (error: any) {
      logger.error('Signup error: ' + error.message)

      // Rôle client non trouvé dans la base de données
      if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
        throw new NotFoundException('Client role not found')
      }

      // Erreur inattendue (base de données, SMTP, etc.)
      throw new InternalServerErrorException('Failed to create account')
    }
  }

  /**
   * Méthode pour se connecter
   * @param {SignInData} data - Les données de connexion de l'utilisateur
   * @returns {Promise<AccessToken>} - Retourne un token d'accès si la connexion est réussie
   */
  public static async signIn(data: SignInData): Promise<AccessToken> {
    try {
      // Récupérer l'utilisateur par son email
      let user: User = await User.findByOrFail('email', data.email)

      // Vérifier si le compte est activé
      if (!user.isActive) {
        throw new BadRequestException('Account is not active')
      }

      // Vérifier les identifiants de l'utilisateur
      user = await User.verifyCredentials(data.email, data.password)

      // Si le compte est activé et que les identifiants sont corrects, créer un token
      return await data.auth.use('api').createToken(user)
    } catch (error: any) {
      logger.error('Sign-in error: ' + error.message)

      // Utilisateur non trouvé
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found')
      }

      // Compte non activé
      if (error instanceof BadRequestException) {
        throw error
      }

      // Identifiants invalides
      if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
        throw new BadRequestException('Invalid credentials')
      }

      // Erreur inattendue
      throw new InternalServerErrorException('Failed to sign in')
    }
  }

  /**
   * Méthode pour se déconnecter
   * @param {SignOutData} data - Les données de déconnexion de l'utilisateur
   * @returns {Promise<void>} - Retourne une promesse qui se résout lorsque l'utilisateur est déconnecté
   */
  public static async signOut(data: SignOutData): Promise<void> {
    try {
      /**
       * Invalider le token d'accès de l'utilisateur
       * Cela supprime le token de la base de données et le rend invalide
       */
      await data.auth.use('api').invalidateToken()
    } catch (error: any) {
      logger.error('Sign-out error: ' + error.message)
      throw new InternalServerErrorException('Failed to sign out')
    }
  }

  /**
   * Méthode pour renvoyer un nouveau code de vérification du compte
   * @param {ResendNewCodeVerificationAccountData} data - Les données pour renvoyer le nouveau code de vérification
   * @returns {Promise<void>} - Retourne une promesse qui se résout lorsque le code est renvoyé
   */
  public static async resendNewCodeVerificationAccount(data: ResendNewCodeVerificationAccountData): Promise<void> {
    try {
      // Récupérer l'utilisateur par son email
      const user: User | null = await User.findBy('email', data.email)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      /**
       * Vu que le premier code d'activation à déjà était générer lors de l'incription
       * on le met à jour avec un nouveau code généré aléatoirement
       * pour éviter de renvoyer le même code à chaque fois
       * et pour éviter que l'utilisateur puisse utiliser le même code plusieurs fois
       */
      const activeCode: number = Math.floor(100000 + Math.random() * 900000)

      // Mettre à jour le code d'activation de l'utilisateur en base de données avec le nouveau code généré
      await user.merge({ activeCode: activeCode }).save()

      // Envoyer un e-mail à l'utilisateur avec le nouveau code d'activation
      await MailService.sendMail(
        user.email,
        'welcome',
        {
          username: user.username,
          code: user.activeCode,
          redirect_uri:
            env.get('FRONTEND_APP_BASE_URL') + env.get('FRONTEND_APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
        },
        'Activation code resend - CrzGames',
      )
    } catch (error: any) {
      logger.error('Resend code error: ' + error.message)

      // Si l'utilisateur n'est pas trouvé, lancer une exception
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found')
      }

      // Si une erreur inattendue se produit, lancer une exception interne du serveur
      throw new InternalServerErrorException('Failed to resend activation code')
    }
  }

  /**
   * Méthode pour vérifier le code d'activation du compte
   * @param {VerifyCodeData} data - Les données de vérification du code
   * @returns {Promise<void>} - Retourne une promesse qui se résout lorsque le code est vérifié
   */
  public static async verifyCode(data: VerifyCodeData): Promise<void> {
    try {
      // Récupérer l'utilisateur par son email
      const user: User | null = await User.findBy('email', data.email)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      // Vérifier si le code d'activation correspond à celui de l'utilisateur en base de données
      if (user.activeCode !== data.code) {
        throw new BadRequestException('Invalid activation code')
      }

      // Mettre à jour l'utilisateur pour indiquer que le compte est activé
      await user.merge({ isActive: true }).save()
    } catch (error: any) {
      logger.error('Verify code error: ' + error.message)

      // Si l'utilisateur n'est pas trouvé, lancer une exception
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found')
      }

      // Si le code d'activation est incorrect, lancer une exception
      if (error instanceof BadRequestException) {
        throw error
      }

      // Si une erreur inattendue se produit, lancer une exception interne du serveur
      throw new InternalServerErrorException('Failed to verify activation code')
    }
  }

  /**
   * Méthode pour envoyer un e-mail de réinitialisation de mot de passe
   * @param {ForgotPasswordData} data - Les données pour la réinitialisation du mot de passe
   * @returns {Promise<void>} - Retourne une promesse qui se résout lorsque l'e-mail est envoyé
   */
  public static async forgotPassword(data: ForgotPasswordData): Promise<void> {
    try {
      // Récupére l'utilisateur par son email
      const user: User | null = await User.findBy('email', data.email)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      /**
       * Check si l'utilisateur a déjà un token de réinitialisation de mot de passe
       * Si oui, on le supprime pour éviter d'avoir plusieurs tokens actifs
       * Cela permet de s'assurer que l'utilisateur ne peut pas utiliser un ancien token pour réinitialiser son mot de passe
       * et de garantir que seul le dernier token envoyé est valide
       */
      const oldPasswordResetToken: PasswordResetToken | null =
        await PasswordResetTokenService.getPasswordResetTokenByUserId(user.id)

      // Supprimer l'ancien token de réinitialisation de mot de passe
      if (oldPasswordResetToken) {
        await PasswordResetTokenService.deletePasswordResetToken(oldPasswordResetToken.id)
      }

      // Créer un nouveau token de réinitialisation de mot de passe
      const passwordResetToken: PasswordResetToken = await PasswordResetTokenService.createPasswordResetToken(user)

      // Envoyer un e-mail à l'utilisateur avec le lien de réinitialisation de mot de passe
      await MailService.sendMail(
        user.email,
        'forgot-password',
        {
          username: user.username,
          redirect_uri:
            env.get('FRONTEND_APP_BASE_URL') +
            env.get('FRONTEND_APP_REDIRECT_URI_FORGOT_PASSWORD') +
            passwordResetToken.token,
        },
        'Forgot password - CrzGames',
      )
    } catch (error: any) {
      logger.error('Forgot password error: ' + error.message)

      // Si l'utilisateur n'est pas trouvé, lancer une exception
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found')
      }

      // Si une erreur inattendue se produit, lancer une exception interne du serveur
      throw new InternalServerErrorException('Failed to send forgot password email')
    }
  }

  /**
   * Méthode pour réinitialiser le mot de passe de l'utilisateur
   * @param {ResetPasswordData} data - Les données pour réinitialiser le mot de passe
   * @returns {Promise<void>} - Retourne une promesse qui se résout lorsque le mot de passe est réinitialisé
   */
  public static async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      // Récupérer le token de réinitialisation de mot de passe par son token, si il existe
      const passwordResetToken: PasswordResetToken = await PasswordResetTokenService.getPasswordResetTokenByToken(
        data.token,
      )

      // Checker si le token est expiré
      if (passwordResetToken.expiresAt < DateTime.now()) {
        throw new BadRequestException('Token expired')
      }

      // Récupérer l'utilisateur par son ID depuis le token de réinitialisation de mot de passe
      const user: User = await User.findOrFail(passwordResetToken.usersId)

      // Vérifier si le nouveau mot de passe est identique à l'ancien
      const isSamePassword: boolean = await hash.verify(user.password, data.newPassword)
      if (isSamePassword) {
        // Si le nouveau mot de passe est identique à l'ancien, lancer une exception
        throw new BadRequestException('New password cannot be same as old password')
      }

      // Décrypter le token de réinitialisation de mot de passe pour vérifier l'email de l'utilisateur
      const decodedToken: string | null = PasswordResetTokenService.decryptResetPasswordToken(data.token)
      if (decodedToken !== user.email) {
        // Si le token décrypté ne correspond pas à l'email de l'utilisateur, lancer une exception
        throw new UnauthorizedException('Unauthorized access')
      }

      // Mettre à jour le mot de passe de l'utilisateur avec le nouveau mot de passe qu'il a choisi
      await user.merge({ password: data.newPassword }).save()

      // Supprimer le token de réinitialisation de mot de passe après utilisation
      await PasswordResetTokenService.deletePasswordResetToken(passwordResetToken.id)
    } catch (error: any) {
      logger.error('Reset password error: ' + error.message)

      if (error instanceof BadRequestException) {
        throw error
      }

      throw new InternalServerErrorException('Failed to reset password')
    }
  }

  /**
   * Méthode pour envoyer un e-mail pour modifier l'email de l'utilisateur
   * @param {SendMailToModifyEmailData} data - Les données pour envoyer l'e-mail de modification d'email
   * @returns {Promise<void>} - Retourne une promesse qui se résout lorsque l'e-mail est envoyé
   */
  public static async sendMailToModifyEmail(data: SendMailToModifyEmailData): Promise<void> {
    try {
      // Récupérer l'utilisateur par son ancien email
      const user: User | null = await User.findBy('email', data.oldEmail)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      // Checker si l'utilisateur a déjà un token de réinitialisation de mot de passe
      const oldPasswordResetToken: PasswordResetToken | null =
        await PasswordResetTokenService.getPasswordResetTokenByUserId(user.id)

      // Supprimer l'ancien token de réinitialisation de mot de passe
      if (oldPasswordResetToken) {
        await PasswordResetTokenService.deletePasswordResetToken(oldPasswordResetToken.id)
      }

      // Créer un nouveau token de réinitialisation de mot de passe
      const passwordResetToken: PasswordResetToken = await PasswordResetTokenService.createPasswordResetToken(user)

      // Envoyer un e-mail à l'utilisateur avec le lien pour modifier son email
      await MailService.sendMail(
        user.email,
        'modify-email',
        {
          username: user.username,
          redirect_uri:
            env.get('FRONTEND_APP_BASE_URL') +
            env.get('FRONTEND_APP_REDIRECT_URI_SEND_MAIL_TO_MODIFY_EMAIL') +
            passwordResetToken.token,
        },
        'Modify Email - CrzGames',
      )
    } catch (error: any) {
      logger.error('Send mail to modify email error: ' + error.message)

      // Si l'utilisateur n'est pas trouvé, lancer une exception
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found')
      }

      // Si une erreur inattendue se produit, lancer une exception interne du serveur
      throw new InternalServerErrorException('Failed to send email to modify email')
    }
  }

  /**
   * Méthode pour réinitialiser l'email de l'utilisateur
   * @param {ResetEmailData} data - Les données pour réinitialiser l'email
   * @returns {Promise<void>} - Retourne une promesse qui se résout lorsque l'email est réinitialisé
   */
  public static async resetEmail(data: ResetEmailData): Promise<void> {
    try {
      // Checker si le token de réinitialisation d'email existe
      const passwordResetToken: PasswordResetToken = await PasswordResetTokenService.getPasswordResetTokenByToken(
        data.token,
      )

      // Checker si le token est expiré
      if (passwordResetToken.expiresAt < DateTime.now()) {
        throw new BadRequestException('Token expired')
      }

      // Rrécupérer l'utilisateur par son ID depuis le token de réinitialisation d'email
      const user: User = await User.findOrFail(passwordResetToken.usersId)

      // Checker si le nouvel email est identique à l'ancien email
      if (user.email === data.newEmail) {
        throw new BadRequestException('New email cannot be same as old email')
      }

      // Décrypter le token de réinitialisation d'email pour vérifier l'email de l'utilisateur
      const decodedToken: string | null = PasswordResetTokenService.decryptResetPasswordToken(data.token)
      if (decodedToken !== user.email) {
        throw new UnauthorizedException('Unauthorized access')
      }

      // Mettre à jour l'email de l'utilisateur avec le nouvel email qu'il a choisi
      await user.merge({ email: data.newEmail }).save()

      // Supprimer le token de réinitialisation d'email après utilisation
      await PasswordResetTokenService.deletePasswordResetToken(passwordResetToken.id)

      // Envoyer un e-mail à l'utilisateur pour confirmer la modification de son email
      await MailService.sendMail(
        user.email,
        'confirm-new-email',
        {
          username: user.username,
          redirect_uri: env.get('FRONTEND_APP_BASE_URL'),
        },
        'Confirm new email - CrzGames',
      )
    } catch (error: any) {
      logger.error('Reset email error: ' + error.message)

      if (error instanceof BadRequestException) {
        throw error
      }

      if (error instanceof UnauthorizedException) {
        throw error
      }

      // Si une erreur inattendue se produit, lancer une exception interne du serveur
      throw new InternalServerErrorException('Failed to reset email')
    }
  }
}
