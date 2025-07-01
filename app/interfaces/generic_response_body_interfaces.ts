/**
 * Interface générique pour les réponses de succès (200, 201, etc.)
 * @interface
 * @property {string} message - Le message de succès
 */
export interface SuccessResponseBody {
  message: string
}

/**
 * Interface générique pour les réponses d'erreur (400, 404, 500, etc.)
 * @interface
 * @property {string} code - Le code d'erreur
 * @property {string} message - Le message d'erreur
 */
export interface ErrorResponseBody {
  code: string
  message: string
}

/**
 * Interface pour les erreurs de validation (via VineJS) en entrée des controleurs
 * @interface
 * @property {string} message - Le message d'erreur de validation
 * @property {string} rule - La règle de validation qui a échoué
 * @property {string} field - Le champ qui a échoué la validation
 */
export interface ValidationError {
  message: string
  rule: string
  field: string
}

/**
 * Interface pour les réponses d'erreur de validation
 * (lorsque VineJS détecte des erreurs de validation)
 * @interface
 * @property {ValidationError[]} errors - Liste des erreurs de validation
 */
export interface ValidationErrorResponseBody {
  errors: ValidationError[]
}
