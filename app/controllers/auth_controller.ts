import AuthService from '#services/auth_service'
import SignUpValidator from '#validators/auth/sign_up_validator'
import ResetPasswordValidator from '#validators/auth/reset_password_validator'
import VerifyCodeValidator from '#validators/auth/verify_code_validator'
import ForgotPasswordValidator from '#validators/auth/forgot_password_validator'
import SendMailToModifyEmailValidator from '#validators/auth/send_mail_to_modify_email_validator'
import ResetEmailValidator from '#validators/auth/reset_email_validator'
import type { HttpContext } from '@adonisjs/core/http'
import SignInValidator from '#validators/auth/sign_in_validator'
import User from '#models/user'
import ResendNewCodeVerificationAccountValidator from '#validators/auth/resend_new_code_verification_account_validator'

export default class AuthController {
  //function to create a new user
  public async signUp({ request, response }: HttpContext): Promise<void> {
    const payload: {
      username: string
      password: string
      email: string
      ip_address: string
      currency_code: string
    } = await request.validate(SignUpValidator)

    await AuthService.signUp(payload)

    response.status(201)
  }

  //function to sign in
  public async signIn({ request, auth }: HttpContext): Promise<any> {
    const payload: { email: string; password: string } = await request.validate(SignInValidator)

    await AuthService.signIn(payload.email)

    const user: any = await User.verifyCredentials(payload.email, payload.password)
    return await auth.use('api').createToken(user)
  }

  //function to sign out
  public async signOut({ response, auth }: HttpContext): Promise<any> {
    await AuthService.signOut(auth)
    response.ok({ message: 'Logged out' })
  }

  public async verifyCode({ request, response }: HttpContext): Promise<any> {
    const payload: { email: string; code: number } = await request.validate(VerifyCodeValidator)
    await AuthService.verifyCode(payload.email, payload.code)
    response.ok({ message: 'Account is active' })
  }

  //function to forgot password
  public async forgotPassword({ request, response }: HttpContext): Promise<any> {
    const payload: { email: string } = await request.validate(ForgotPasswordValidator)
    await AuthService.forgotPassword(payload.email)
    response.ok({ message: 'An Email was sent to modify your password' })
  }

  //function to reset password
  public async resetPassword({ request, response }: HttpContext): Promise<any> {
    const payload: { token: string; newPassword: string } = await request.validate(ResetPasswordValidator)
    await AuthService.resetPassword(payload.token, payload.newPassword)
    response.ok({ message: 'Password was reset' })
  }

  //function to modify email
  public async sendMailToModifyEmail({ request, response }: HttpContext): Promise<any> {
    const payload: { email: string } = await request.validate(SendMailToModifyEmailValidator)
    await AuthService.sendMailToModifyEmail(payload.email)
    return response.ok({ message: 'Email was sent to modify your address' })
  }

  //function to reset email
  public async resetEmail({ request, response }: HttpContext): Promise<any> {
    const payload: { token: string; newEmail: string } = await request.validate(ResetEmailValidator)
    await AuthService.resetEmail(payload.token, payload.newEmail)
    return response.ok({ message: 'Email was reset' })
  }

  public async resendNewCodeVerificationAccount({ request, response }: HttpContext): Promise<any> {
    const payload: { email: string } = await request.validate(ResendNewCodeVerificationAccountValidator)
    await AuthService.resendNewCodeVerificationAccount(payload.email)
    return response.ok({ message: 'An Email was sent to modify your password' })
  }
}
