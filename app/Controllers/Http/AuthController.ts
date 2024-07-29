import AuthService from 'App/Services/AuthService'
import SignUpValidator from 'App/Validators/Auth/SignUpValidator'
import ResetPasswordValidator from 'App/Validators/Auth/ResetPasswordValidator'
import VerifyCodeValidator from 'App/Validators/Auth/VerifyCodeValidator'
import ForgotPasswordValidator from 'App/Validators/Auth/ForgotPasswordValidator'
import SendMailToModifyEmailValidator from 'App/Validators/Auth/SendMailToModifyEmailValidator'
import ResetEmailValidator from 'App/Validators/Auth/ResetEmailValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SignInValidator from 'App/Validators/Auth/SignInValidator'
import Env from '@ioc:Adonis/Core/Env'
import ResendNewCodeVerificationAccountValidator from 'App/Validators/Auth/resendNewCodeVerificationAccountValidator'

export default class AuthController {
  //function to create a new user
  private async signUp({ request, response }: HttpContextContract): Promise<void> {
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
  private async signIn({ request, auth }: HttpContextContract): Promise<any> {
    const payload: { email: string; password: string } = await request.validate(SignInValidator)

    await AuthService.signIn(payload.email)

    return auth.use('api').attempt(payload.email, payload.password, {
      name: 'Auth Login Access Token',
      expiresIn: Env.get('API_USER_TOKEN_EXPIRES_IN'),
    })
  }

  //function to sign out
  private async signOut({ response, auth }: HttpContextContract): Promise<any> {
    await AuthService.signOut(auth)
    response.ok({ message: 'Logged out' })
  }

  private async verifyCode({ request, response }: HttpContextContract): Promise<any> {
    const payload: { email: string; code: number } = await request.validate(VerifyCodeValidator)
    await AuthService.verifyCode(payload.email, payload.code)
    response.ok({ message: 'Account is active' })
  }

  //function to forgot password
  private async forgotPassword({ request, response }: HttpContextContract): Promise<any> {
    const payload: { email: string } = await request.validate(ForgotPasswordValidator)
    await AuthService.forgotPassword(payload.email)
    response.ok({ message: 'An Email was sent to modify your password' })
  }

  //function to reset password
  private async resetPassword({ request, response }: HttpContextContract): Promise<any> {
    const payload: { token: string; newPassword: string } =
      await request.validate(ResetPasswordValidator)
    await AuthService.resetPassword(payload.token, payload.newPassword)
    response.ok({ message: 'Password was reset' })
  }

  //function to modify email
  private async sendMailToModifyEmail({ request, response }: HttpContextContract): Promise<any> {
    const payload: { email: string } = await request.validate(SendMailToModifyEmailValidator)
    await AuthService.sendMailToModifyEmail(payload.email)
    return response.ok({ message: 'Email was sent to modify your address' })
  }

  //function to reset email
  private async resetEmail({ request, response }: HttpContextContract): Promise<any> {
    const payload: { token: string; newEmail: string } = await request.validate(ResetEmailValidator)
    await AuthService.resetEmail(payload.token, payload.newEmail)
    return response.ok({ message: 'Email was reset' })
  }

  private async resendNewCodeVerificationAccount({
    request,
    response,
  }: HttpContextContract): Promise<any> {
    const payload: { email: string } = await request.validate(
      ResendNewCodeVerificationAccountValidator,
    )
    await AuthService.resendNewCodeVerificationAccount(payload.email)
    return response.ok({ message: 'An Email was sent to modify your password' })
  }
}
