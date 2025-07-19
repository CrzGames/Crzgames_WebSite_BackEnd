import type { Authenticator } from '@adonisjs/auth'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Données pour l'inscription des utilisateurs dans la couche du service 'auth_service.ts'.
 * @type {object} SignUpData
 * @property {string} username - Nom d'utilisateur choisi par l'utilisateur.
 * @property {string} email - Adresse e-mail de l'utilisateur.
 * @property {string} password - Mot de passe choisi par l'utilisateur.
 * @property {string} ip_address - Adresse IP de l'utilisateur.
 * @property {string} currency_code - Code de la devise préférée de l'utilisateur.
 */
export type SignUpData = {
  username: string
  email: string
  password: string
  ip_address: string
  currency_code: string
}

/**
 * Données pour la connexion des utilisateurs dans la couche du service 'auth_service.ts'.
 * @type {object} SignInData
 * @property {string} email - Adresse e-mail de l'utilisateur.
 * @property {string} password - Mot de passe de l'utilisateur.
 * @property {Authenticator<Authenticators>} auth - Authenticator utilisé pour l'authentification.
 */
export type SignInData = {
  email: string
  password: string
  auth: Authenticator<Authenticators>
}

/**
 * Données pour la déconnexion des utilisateurs dans la couche du service 'auth_service.ts'.
 * @type {object} SignOutData
 * @property {Authenticator<Authenticators>} auth - Authenticator utilisé pour l'authentification.
 */
export type SignOutData = {
  auth: Authenticator<Authenticators>
}

/**
 * Données pour la vérification du code d'activation du compte dans la couche du service 'auth_service.ts'.
 * @type {object} VerifyCodeData
 * @property {string} email - Adresse e-mail de l'utilisateur.
 * @property {number} code - Code d'activation envoyé par e-mail.
 */
export type VerifyCodeData = {
  email: string
  code: number
}

/**
 * Données pour renvoyer un nouveau code de vérification du compte dans la couche du service 'auth_service.ts'.
 * @type {object} ResendNewCodeVerificationAccountData
 * @property {string} email - Adresse e-mail de l'utilisateur.
 */
export type ResendNewCodeVerificationAccountData = {
  email: string
}

/**
 * Données pour la réinitialisation du mot de passe dans la couche du service 'auth_service.ts'.
 * @type {object} ResetPasswordData
 * @property {string} email - Adresse e-mail de l'utilisateur à qui envoyer le lien de réinitialisation du mot de passe.
 */
export type ForgotPasswordData = {
  email: string
}

/**
 * Données pour la réinitialisation du mot de passe dans la couche du service 'auth_service.ts'.
 * @type {object} ResetPasswordData
 * @property {string} newPassword - Nouveau mot de passe choisi par l'utilisateur.
 * @property {string} token - Token de réinitialisation du mot de passe envoyé par e-mail.
 */
export type ResetPasswordData = {
  newPassword: string
  token: string
}

/**
 * Données pour envoyer un e-mail pour modifier l'email de l'utilisateur dans la couche du service 'auth_service.ts'.
 * @type {object} SendMailToModifyEmailData
 * @property {string} oldEmail - Ancien e-mail de l'utilisateur.
 */
export type SendMailToModifyEmailData = {
  oldEmail: string
}

/**
 * Données pour réinitialiser l'email de l'utilisateur dans la couche du service 'auth_service.ts'.
 * @type {object} ResetEmailData
 * @property {string} token - Token de réinitialisation de l'email envoyé par e-mail.
 * @property {string} email - Nouvel email que l'utilisateur souhaite utiliser.
 */
export type ResetEmailData = {
  token: string
  newEmail: string
}
