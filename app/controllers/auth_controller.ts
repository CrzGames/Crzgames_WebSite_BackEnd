import AuthService from '#services/auth_service'
import { forgotPasswordValidator } from '#validators/auth/forgot_password_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { resendNewCodeVerificationAccountValidator } from '#validators/auth/resend_new_code_verification_account_validator'
import { signUpValidator } from '#validators/auth/signup_validator'
import { signInValidator } from '#validators/auth/signin_validator'
import { verifyCodeValidator } from '#validators/auth/verify_code_validator'
import { resetPasswordValidator } from '#validators/auth/reset_password_validator'
import { sendMailToModifyEmailValidator } from '#validators/auth/send_mail_to_modify_email_validator'
import { resetEmailValidator } from '#validators/auth/reset_email_validator'
import type { AccessToken } from '@adonisjs/auth/access_tokens'
import type {
  ForgotPasswordRequestBody,
  ResendNewCodeVerificationAccountRequestBody,
  ResetEmailRequestBody,
  ResetPasswordRequestBody,
  SendMailToModifyEmailRequestBody,
  SignUpRequestBody,
  SingInRequestBody,
  VerifyCodeRequestBody,
} from '#interfaces/auth_request_body_interfaces'
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

/**
 * Controller to handle user authentication operations
 */
export default class AuthController {
  /**
   * @signUp
   * @operationId signUp
   * @tag Auth
   * @summary Inscription d'un utilisateur
   * @description Crée un nouveau compte utilisateur et envoie un e-mail avec un code d'activation à 6 chiffres pour activer le compte
   * @requestBody <SignUpRequestBody>
   * @content application/json
   * @responseBody 201 - <SuccessResponseBody> - Compte créé avec succès
   * @responseBody 400 - <ErrorResponseBody> - Rôle utilisateur introuvable
   * @responseBody 422 - <ValidationErrorResponseBody> - Erreurs de validation des données
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Handle user signup
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async signUp({ request, response }: HttpContext): Promise<void> {
    const payload: SignUpRequestBody = await request.validateUsing(signUpValidator)
    const data: SignUpData = {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      ip_address: payload.ip_address,
      currency_code: payload.currency_code,
    }
    await AuthService.signUp(data)
    response.status(201).json({ message: 'Account created successfully' })
  }

  /**
   * @signIn
   * @operationId signIn
   * @tag Auth
   * @summary Connexion d'un utilisateur
   * @description Connecte un utilisateur et retourne un token d'accès pour les requêtes ultérieures
   * @requestBody <SingInRequestBody>
   * @content application/json
   * @responseBody 200 - <LoginSuccessResponseBody> - Token d'accès généré
   * @responseBody 400 - <ErrorResponseBody> - Invalid credentials / Account is not active
   * @responseBody 404 - <ErrorResponseBody> - User not found
   * @responseBody 422 - <ValidationErrorResponseBody> - Erreurs de validation des données
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Handle user login
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['auth']} ctx.auth - The authentication object
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with an access token
   */
  public async signIn({ request, response, auth }: HttpContext): Promise<void> {
    const payload: SingInRequestBody = await request.validateUsing(signInValidator)
    const data: SignInData = {
      email: payload.email,
      password: payload.password,
      auth,
    }
    const authToken: AccessToken = await AuthService.signIn(data)
    response.status(200).json(authToken)
  }

  /**
   * @signOut
   * @operationId signOut
   * @tag Auth
   * @summary Déconnexion d'un utilisateur
   * @description Déconnecte l'utilisateur actuel
   * @responseBody 200 - <SuccessResponseBody> - Déconnexion réussie
   * @responseBody 401 - <ErrorResponseBody> - Erreur d'authentification
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Handle user logout
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['auth']} ctx.auth - The authentication object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async signOut({ response, auth }: HttpContext): Promise<void> {
    const data: SignOutData = {
      auth,
    }
    await AuthService.signOut(data)
    response.status(200).json({ message: 'Successfully logged out' })
  }

  /**
   * @verifyCode
   * @operationId verifyCode
   * @tag Auth
   * @summary Vérification du code d'activation
   * @description Vérifie le code de validation pour activer le compte
   * @requestBody <VerifyCodePayload>
   * @content application/json
   * @responseBody 200 - <SuccessResponseBody> - Compte activé avec succès
   * @responseBody 400 - <ErrorResponseBody> - Code de validation invalide
   * @responseBody 404 - <ErrorResponseBody> - Utilisateur introuvable
   * @responseBody 422 - <ValidationErrorResponseBody> - Erreurs de validation des données
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Verify the activation code for a user account
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async verifyCode({ request, response }: HttpContext): Promise<void> {
    const payload: VerifyCodeRequestBody = await request.validateUsing(verifyCodeValidator)
    const data: VerifyCodeData = {
      email: payload.email,
      code: payload.code,
    }
    await AuthService.verifyCode(data)
    response.status(200).json({ message: 'Account activated successfully' })
  }

  /**
   * @forgotPassword
   * @operationId forgotPassword
   * @tag Auth
   * @summary Demande de réinitialisation de mot de passe
   * @description Envoie un e-mail pour réinitialiser le mot de passe
   * @requestBody <ForgotPasswordPayload>
   * @content application/json
   * @responseBody 200 - <SuccessResponseBody> - E-mail envoyé pour réinitialiser le mot de passe
   * @responseBody 404 - <ErrorResponseBody> - Utilisateur introuvable
   * @responseBody 422 - <ValidationErrorResponseBody> - Erreurs de validation des données
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Request a password reset email
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async forgotPassword({ request, response }: HttpContext): Promise<void> {
    const payload: ForgotPasswordRequestBody = await request.validateUsing(forgotPasswordValidator)
    const data: ForgotPasswordData = {
      email: payload.email,
    }
    await AuthService.forgotPassword(data)
    response.status(200).json({ message: 'Email sent to reset your password' })
  }

  /**
   * @resetPassword
   * @operationId resetPassword
   * @tag Auth
   * @summary Réinitialisation du mot de passe
   * @description Réinitialise le mot de passe avec un token
   * @requestBody <ResetPasswordPayload>
   * @content application/json
   * @responseBody 200 - <SuccessResponseBody> - Mot de passe réinitialisé avec succès
   * @responseBody 400 - <ErrorResponseBody> - Le nouveau mot de passe est le même que l'ancien mot de passe ou token expiré
   * @responseBody 401 - <ErrorResponseBody> - Accès non autorisé
   * @responseBody 422 - <ValidationErrorResponseBody> - Erreurs de validation des données
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Reset user password using a token
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async resetPassword({ request, response }: HttpContext): Promise<void> {
    const payload: ResetPasswordRequestBody = await request.validateUsing(resetPasswordValidator)
    const data: ResetPasswordData = {
      token: payload.token,
      newPassword: payload.newPassword,
    }
    await AuthService.resetPassword(data)
    response.status(200).json({ message: 'Password was reset' })
  }

  /**
   * @sendMailToModifyEmail
   * @operationId sendMailToModifyEmail
   * @tag Auth
   * @summary Envoi d'un e-mail pour modifier l'adresse e-mail
   * @description Envoie un e-mail pour permettre la modification de l'adresse e-mail
   * @requestBody <SendMailToModifyEmailPayload>
   * @content application/json
   * @responseBody 200 - <SuccessResponseBody> - E-mail envoyé pour modifier l'adresse-e-mail
   * @responseBody 404 - <ErrorResponseBody> - Utilisateur introuvable
   * @responseBody 422 - <ValidationErrorResponseBody> - Erreurs de validation des données
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Send an email to modify the user's email address
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async sendMailToModifyEmail({ request, response }: HttpContext): Promise<void> {
    const payload: SendMailToModifyEmailRequestBody = await request.validateUsing(sendMailToModifyEmailValidator)
    const data: SendMailToModifyEmailData = {
      oldEmail: payload.email,
    }
    await AuthService.sendMailToModifyEmail(data)
    response.status(200).json({ message: 'An Email was sent to modify your email address' })
  }

  /**
   * @resetEmail
   * @operationId resetEmail
   * @tag Auth
   * @summary Modification de l'adresse e-mail
   * @description Modifie l'adresse e-mail avec un token
   * @requestBody <ResetEmailPayload>
   * @content application/json
   * @responseBody 200 - <SuccessResponseBody> - Adresse e-mail modifiée avec succès
   * @responseBody 400 - <ErrorResponseBody> - Token expiré ou nouvel e-mail identique à l'ancien
   * @responseBody 401 - <ErrorResponseBody> - Accès non autorisé
   * @responseBody 404 - <ErrorResponseBody> - Utilisateur introuvable
   * @responseBody 422 - <ValidationErrorResponseBody> - Erreurs de validation des données
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Reset user email using a token
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async resetEmail({ request, response }: HttpContext): Promise<void> {
    const payload: ResetEmailRequestBody = await request.validateUsing(resetEmailValidator)
    const data: ResetEmailData = {
      token: payload.token,
      newEmail: payload.newEmail,
    }
    await AuthService.resetEmail(data)
    response.status(200).json({ message: 'Email was modified successfully' })
  }

  /**
   * @resendNewCodeVerificationAccount
   * @operationId resendNewCodeVerificationAccount
   * @tag Auth
   * @summary Renvoi d'un code de vérification
   * @description Renvoye un nouveau code de vérification pour le compte
   * @requestBody <ResendNewCodeVerificationAccountPayload>
   * @content application/json
   * @responseBody 200 - <SuccessResponseBody> - Nouveau code de vérification envoyé
   * @responseBody 404 - <ErrorResponseBody> - Utilisateur introuvable
   * @responseBody 422 - <ValidationErrorResponseBody> - Erreurs de validation des données
   * @responseBody 500 - <ErrorResponseBody> - Erreur interne du serveur
   */
  /**
   * Resend a new verification code for the user account
   * @param {HttpContext} ctx - The HTTP context containing the request and response objects
   * @param {HttpContext['request']} ctx.request - The HTTP request object
   * @param {HttpContext['response']} ctx.response - The HTTP response object
   * @returns {Promise<void>} - A promise that resolves with no return value
   */
  public async resendNewCodeVerificationAccount({ request, response }: HttpContext): Promise<void> {
    const payload: ResendNewCodeVerificationAccountRequestBody = await request.validateUsing(
      resendNewCodeVerificationAccountValidator,
    )
    const data: ResendNewCodeVerificationAccountData = {
      email: payload.email,
    }
    await AuthService.resendNewCodeVerificationAccount(data)
    response.status(200).json({ message: 'New verification code sent' })
  }
}
