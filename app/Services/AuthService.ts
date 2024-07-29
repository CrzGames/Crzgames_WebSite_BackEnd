import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import MailService from 'App/Services/MailService'
import Env from '@ioc:Adonis/Core/Env'
import PasswordResetTokenService from 'App/Services/PasswordResetTokenService'
import PasswordResetToken from 'App/Models/PasswordResetToken'
import { DateTime } from 'luxon'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'
import { UserRoles } from 'App/Enums/UserRoles'
import UserRolesService from 'App/Services/UserRolesService'
import UserRole from 'App/Models/UserRole'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import Logger from '@ioc:Adonis/Core/Logger'

type RegisterCommand = {
  username: string
  email: string
  password: string
  ip_address: string
  currency_code: string
}

export default class AuthService {
  // Fonction pour créer un nouveau user
  public static async signUp(data: RegisterCommand): Promise<void> {
    // generate active code
    const activeCode: number = Math.floor(100000 + Math.random() * 900000)

    const clientRole: UserRole = await UserRolesService.getUserRoleByName(UserRoles.CLIENT)

    const user: User = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      roles_id: clientRole.id,
      currency_code: data.currency_code,
      ip_address: data.ip_address,
      ip_region: null,
      active_code: activeCode,
    })

    await MailService.sendMail(
      user.email,
      'welcome',
      {
        username: user.username,
        code: user.active_code,
        redirect_uri: Env.get('APP_BASE_URL') + Env.get('APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
      },
      'Welcome to CrzGames',
    )
  }

  //fonction pour se connecter
  public static async signIn(email: string): Promise<void> {
    if (!(await this.isActive(email))) {
      throw new BadRequestException('Account is not active')
    }
  }

  //function pour se deconnecter
  public static async signOut(auth): Promise<void> {
    await auth.use('api').logout()
  }

  //fucnton verifier is active
  public static async isActive(email: string): Promise<boolean> {
    const user: User = await User.findByOrFail('email', email)
    return user.is_active
  }

  public static async resendNewCodeVerificationAccount(email: string): Promise<void> {
    const user: User = await User.findByOrFail('email', email)

    // Vu que le premier code d'activation à déjà était générer lors de l'incription
    // on le met à jour avec un nouveau code
    const activeCode: number = Math.floor(100000 + Math.random() * 900000)
    await user.merge({ active_code: activeCode }).save()

    try {
      await MailService.sendMail(
        user.email,
        'welcome',
        {
          username: user.username,
          code: user.active_code,
          redirect_uri: Env.get('APP_BASE_URL') + Env.get('APP_REDIRECT_URI_ACCOUNT_VALIDATE') + user.email,
        },
        'Activation code resend - CrzGames',
      )
    } catch (error) {
      Logger.error(error.message)
    }
  }

  //function pour verifier le code
  public static async verifyCode(email: string, code: number): Promise<void> {
    const user: User = await User.findByOrFail('email', email)

    if (user.active_code !== code) {
      throw new BadRequestException('Invalid code')
    }

    await user.merge({ is_active: true }).save()
  }

  //function pour forgot password
  public static async forgotPassword(email: string): Promise<void> {
    // check if user exist
    const user: User = await User.findByOrFail('email', email)

    try {
      // check if already have password reset token
      const oldPasswordResetToken: PasswordResetToken =
        await PasswordResetTokenService.getPasswordResetTokenByUserId(user.id)

      await PasswordResetTokenService.deletePasswordResetToken(oldPasswordResetToken.id)
    } catch (error) {
      Logger.error(error.message)
    }

    // create new password reset token
    const passwordResetToken: PasswordResetToken =
      await PasswordResetTokenService.createPasswordResetToken(user)

    await MailService.sendMail(
      user.email,
      'forgot-password',
      {
        username: user.username,
        redirect_uri:
          Env.get('APP_BASE_URL') +
          Env.get('APP_REDIRECT_URI_FORGOT_PASSWORD') +
          passwordResetToken.token,
      },
      'Forgot password - CrzGames',
    )
  }

  //function pour reset password
  public static async resetPassword(token: string, password: string): Promise<void> {
    const passwordResetToken: PasswordResetToken =
      await PasswordResetTokenService.getPasswordResetTokenByToken(token)

    if (!passwordResetToken.expires_at) throw new BadRequestException()

    // check if token is expired
    if (passwordResetToken.expires_at < DateTime.now()) {
      throw new BadRequestException('Token expired')
    }

    //get user
    const user: User = await User.findOrFail(passwordResetToken.users_id)

    //check if new password is same as old password
    const isSamePassword: boolean = await Hash.verify(user.password, password)
    if (isSamePassword) {
      throw new BadRequestException('New password cannot be same as old password')
    }

    const decodedToken: string | null = PasswordResetTokenService.decryptResetPasswordToken(token)
    if (decodedToken !== user.email) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS',
        'unauthorized',
      )
    }

    //update password
    await user.merge({ password }).save()

    //delete password reset token
    await PasswordResetTokenService.deletePasswordResetToken(passwordResetToken.id)
  }

  //function to send a mail to modify email
  public static async sendMailToModifyEmail(oldEmail: string): Promise<void> {
    //check if user exist
    const user: User = await User.findByOrFail('email', oldEmail)

    // check if already have password reset token
    try {
      const oldPasswordResetToken: PasswordResetToken =
        await PasswordResetTokenService.getPasswordResetTokenByUserId(user.id)

      await PasswordResetTokenService.deletePasswordResetToken(oldPasswordResetToken.id)
    } catch (error) {
      Logger.error(error.message)
    }

    // create new password reset token
    const passwordResetToken: PasswordResetToken =
      await PasswordResetTokenService.createPasswordResetToken(user)

    await MailService.sendMail(
      user.email,
      'modify-email',
      {
        username: user.username,
        redirect_uri:
          Env.get('APP_BASE_URL') +
          Env.get('APP_REDIRECT_URI_SEND_MAIL_TO_MODIFY_EMAIL') +
          passwordResetToken.token,
      },
      'Modify Email - CrzGames',
    )
  }

  //function to reset email
  public static async resetEmail(token: string, email: string): Promise<void> {
    //check if reset password token exist
    const passwordResetToken: PasswordResetToken =
      await PasswordResetTokenService.getPasswordResetTokenByToken(token)

    if (!passwordResetToken.expires_at) throw new BadRequestException()

    //check if token is expired
    if (passwordResetToken.expires_at < DateTime.now()) {
      throw new BadRequestException('Token expired')
    }

    //get user
    const user: User = await User.findOrFail(passwordResetToken.users_id)

    //check if new email is same as old email
    if (user.email === email) {
      throw new BadRequestException('New email cannot be same as old email')
    }

    const decodedToken: string | null = PasswordResetTokenService.decryptResetPasswordToken(token)

    if (decodedToken !== user.email) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS',
        'unauthorized',
      )
    }

    //update email
    await user.merge({ email }).save()

    //delete password reset token
    await PasswordResetTokenService.deletePasswordResetToken(passwordResetToken.id)

    //send mail to confirm the new email
    await MailService.sendMail(
      user.email,
      'confirm-new-email',
      {
        username: user.username,
        redirect_uri: Env.get('APP_BASE_URL'),
      },
      'Confirm new email - CrzGames',
    )
  }
}
