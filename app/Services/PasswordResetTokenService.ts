import Encryption from '@ioc:Adonis/Core/Encryption'
import User from 'App/Models/User'
import PasswordResetToken from 'App/Models/PasswordResetToken'
import { DateTime } from 'luxon'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import Env from '@ioc:Adonis/Core/Env'

export default class PasswordResetTokenService {
  //Function to create a new password reset token
  public static async createPasswordResetToken(user: User): Promise<PasswordResetToken> {
    try {
      const token: string = this.generateResetPasswordToken(user.email)
      const expiresAt: DateTime = DateTime.local().plus({
        minutes: Env.get('MAIL_TOKEN_VALID_MINUTES'),
      })

      return await PasswordResetToken.create({
        users_id: user.id,
        token: token,
        expires_at: expiresAt,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  //Function to delete a password reset token
  public static async deletePasswordResetToken(id: number): Promise<void> {
    const passwordResetToken: PasswordResetToken = await PasswordResetToken.findOrFail(id)

    try {
      await passwordResetToken.delete()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  //function to get a password reset token by userId
  public static async getPasswordResetTokenByUserId(userId: number): Promise<PasswordResetToken> {
    try {
      return await PasswordResetToken.findByOrFail('users_id', userId)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  //function to get a password reset token by token
  public static async getPasswordResetTokenByToken(token: string): Promise<PasswordResetToken> {
    try {
      return await PasswordResetToken.findByOrFail('token', token)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  //function to generate a reset password token
  public static generateResetPasswordToken(email: string): string {
    return Encryption.encrypt(email)
  }

  //function to decrypt a reset password token
  public static decryptResetPasswordToken(token: string): string | null {
    return Encryption.decrypt(token)
  }
}
