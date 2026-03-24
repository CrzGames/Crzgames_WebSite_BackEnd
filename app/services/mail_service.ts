import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import edge from 'edge.js'
import mjml from 'mjml'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import logger from '@adonisjs/core/services/logger'
import type { Message } from '@adonisjs/mail'
import Mailjet from 'node-mailjet'

/**
 * Un service pour envoyer des e-mails.
 * Ce service fournit une méthode pour envoyer des e-mails à un ou plusieurs utilisateurs
 * en utilisant Mailjet pour les environnements de production et AdonisJS Mail pour les environnements de test et de développement via SMTP.
 * Il utilise MJML pour rendre les e-mails au format HTML.
 * @class MailService
 */
export default class MailService {
  public static async sendMail(
    emailUsers: string[] | string,
    viewEmail: string,
    data: Record<string, any>,
    emailSubject: string,
  ): Promise<void> {
    try {
      const viewRender: string = await edge.render('emails/' + viewEmail, data)
      const htmlRender: string = mjml(viewRender).html

      // Envoi de l'e-mail avec Mailjet pour les environnements de staging, production, etc via l'API Mailjet.
      if (env.get('NODE_ENV') !== 'test' && env.get('NODE_ENV') !== 'development') {
        const mailjet: any = new Mailjet({
          apiKey: env.get('MAILJET_API_KEY'),
          apiSecret: env.get('MAILJET_API_SECRET_KEY'),
        })

        const toRecipients: {
          Email: string
        }[] = Array.isArray(emailUsers)
          ? emailUsers.map((email: string) => ({ Email: email }))
          : [{ Email: emailUsers }]

        const request: any = mailjet.post('send', { version: env.get('MAIJET_API_VERSION') }).request({
          Messages: [
            {
              From: {
                Email: env.get('MAIL_FROM_ADDRESS'),
                Name: env.get('MAIL_FROM_NAME'),
              },
              To: toRecipients,
              Subject: emailSubject,
              HTMLPart: htmlRender,
            },
          ],
        })
        await request // Attendre la résolution de la promesse
        logger.info('Mailjet send success: %s' + JSON.stringify(request))
      }

      // Envoi de l'e-mail avec AdonisJS Mail pour les environnements de test et de développement via SMTP
      else {
        // Si c'est 1 seul utilisateur, on envoie à l'utilisateur
        if (typeof emailUsers === 'string') {
          await mail.sendLater((message: Message): void => {
            message.from(env.get('MAIL_FROM_ADDRESS')).to(emailUsers).subject(emailSubject).html(htmlRender)
          })
        }
        // Si c'est un tableau d'utilisateurs, on envoie à chaque utilisateur
        else if (Array.isArray(emailUsers)) {
          await Promise.all(
            emailUsers.map((emailUser: string): Promise<void> => {
              return mail.sendLater((message: Message) => {
                message.from(env.get('MAIL_FROM_ADDRESS')).to(emailUser).subject(emailSubject).html(htmlRender)
              })
            }),
          )
        }
      }
    } catch (error: any) {
      logger.error('Send mail error: ' + error.message)

      // Erreur lors de l'envoi de l'e-mail
      throw new InternalServerErrorException('Failed to send email')
    }
  }
}
