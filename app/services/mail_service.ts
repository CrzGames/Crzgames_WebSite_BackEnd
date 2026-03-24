import mail from '@adonisjs/mail/services/main'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import logger from '@adonisjs/core/services/logger'
import type { Message } from '@adonisjs/mail'

/**
 * Un service pour envoyer des e-mails.
 * Ce service fournit une méthode pour envoyer des e-mails à un ou plusieurs utilisateurs.
 * Le choix du transport (SMTP / Resend) est piloté par `MAIL_MAILER` dans `config/mail.ts`.
 */
export default class MailService {
  /**
   * Envoie (ou met en file d'attente) un e-mail à un ou plusieurs destinataires.
   */
  public static async sendMail(
    emailUsers: string[] | string,
    viewEmail: string,
    data: Record<string, unknown>,
    emailSubject: string,
  ): Promise<void> {
    try {
      const recipients: string[] = Array.isArray(emailUsers) ? emailUsers : [emailUsers]

      await Promise.all(
        recipients.map((emailUser: string): Promise<void> => {
          return mail.sendLater((message: Message): void => {
            message.to(emailUser).subject(emailSubject).htmlView(`emails/${viewEmail}`, data)
          })
        }),
      )

      logger.info(`[MailService] Email queued for ${recipients.length} recipient(s).`)
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : String(error)
      logger.error(`Send mail error: ${errorMessage}`)

      // Erreur lors de l'envoi de l'e-mail
      throw new InternalServerErrorException('Failed to send email')
    }
  }
}
