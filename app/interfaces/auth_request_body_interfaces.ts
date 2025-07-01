/**
 * Interface pour le corps de la requête d'inscription
 * @interface
 * @property {string} username - Le nom d'utilisateur
 * @property {string} email - L'email de l'utilisateur
 * @property {string} password - Le mot de passe de l'utilisateur
 * @property {string} ip_address - L'adresse IP de l'utilisateur
 * @property {string} currency_code - Le code de la devise de l'utilisateur (USD, EUR, GBP)
 */
export interface SignUpRequestBody {
  username: string
  email: string
  password: string
  ip_address: string
  currency_code: string
}

/**
 * Interface pour le corps de la requête de connexion
 * @interface
 * @property {string} email - L'email de l'utilisateur
 * @property {string} password - Le mot de passe de l'utilisateur
 */
export interface SingInRequestBody {
  email: string
  password: string
}

/**
 * Interface pour le corps de la requête pour la vérification
 * du code d'activation du compte lors de l'inscription
 * @interface
 * @property {string} email - L'email de l'utilisateur
 * @property {number} code - Le code d'activation envoyé par email
 */
export interface VerifyCodeRequestBody {
  email: string
  code: number
}

/**
 * Interface pour le corps de la requête de mot de passe oublié
 * @interface
 * @property {string} email - L'email de l'utilisateur
 */
export interface ForgotPasswordRequestBody {
  email: string
}

/**
 * Interface pour le corps de la requête de réinitialisation du mot de passe
 * @interface
 * @property {string} token - Le token de réinitialisation du mot de passe
 * @property {string} newPassword - Le nouveau mot de passe de l'utilisateur
 */
export interface ResetPasswordRequestBody {
  token: string
  newPassword: string
}

/**
 * Interface pour le corps de la requête pour envoyer un email
 * pour modifier l'email de l'utilisateur
 * @interface
 * @property {string} email - L'email de l'utilisateur à modifier
 */
export interface SendMailToModifyEmailRequestBody {
  email: string
}

/**
 * Interface pour le corps de la requête de réinitialisation de l'email
 * @interface
 * @property {string} token - Le token de réinitialisation de l'email
 * @property {string} newEmail - Le nouvel email de l'utilisateur
 */
export interface ResetEmailRequestBody {
  token: string
  newEmail: string
}

/**
 * Interface pour le corps de la requête pour renvoyer un nouveau code
 * de vérification du compte lors de l'inscription
 * @interface
 * @property {string} email - L'email de l'utilisateur pour lequel renvoyer le code
 */
export interface ResendNewCodeVerificationAccountRequestBody {
  email: string
}
