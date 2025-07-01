/**
 * Interface pour la réponse de succès de connexion
 * @interface
 * @property {string} token - Le token d'authentification pour l'utilisateur pour les requêtes ultérieures
 * @property {string} type - Le type de token (par exemple, Bearer)
 * @property {Date} expiresAt - La date d'expiration du token
 */
export interface LoginSuccessResponseBody {
  token: string
  type: string
  expiresAt: Date
}
