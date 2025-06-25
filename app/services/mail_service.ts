import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import edge from 'edge.js'
import mjml from 'mjml'
import Mailjet, { LibraryResponse, Request } from 'node-mailjet'
import { InternalServerErrorException } from '#exceptions/internal_server_error_exception'
import logger from '@adonisjs/core/services/logger'
import { RequestData } from 'node-mailjet/declarations/request/Request'
import { BaseMailer } from '@adonisjs/mail'
import { Message } from '@adonisjs/mail'

export default class MailService extends BaseMailer {
  public static async sendMail(
    emailUsers: string[] | string,
    viewEmail: string,
    data: any,
    emailSubject: string,
  ): Promise<void> {
    try {
      const viewRender: string = await edge.render('emails/' + viewEmail, data)
      const htmlRender: string = mjml(viewRender).html

      // use MailJet for environment staging and production
      if (env.get('NODE_ENV') !== 'test' && env.get('NODE_ENV') !== 'development') {
        const mailjet: Mailjet = new Mailjet({
          apiKey: env.get('MAILJET_API_KEY'),
          apiSecret: env.get('MAILJET_API_SECRET_KEY'),
        })

        const toRecipients = Array.isArray(emailUsers)
          ? emailUsers.map((email) => ({ Email: email }))
          : [{ Email: emailUsers }]

        const request: Promise<LibraryResponse<RequestData>> = mailjet
          .post('send', { version: env.get('MAIJET_API_VERSION') })
          .request({
            Messages: [
              {
                From: {
                  Email: env.get('MAIL_USERNAME'),
                  Name: 'CrzGames',
                },
                To: toRecipients,
                Subject: emailSubject,
                HTMLPart: htmlRender,
              },
            ],
          })
        request
          .then((result: LibraryResponse<RequestData>): void => {
            logger.log('MAILJET POST THEN : ', JSON.stringify(result))
          })
          .catch((error: any): void => {
            logger.error('MAILJET POST CATCH : ', error)
          })
      }

      // use SMTP protocol to environment develop
      // Pushed to in-memory queue
      else {
        if (typeof emailUsers === 'string') {
          await mail.sendLater((message: Message): void => {
            message.from(env.get('MAIL_USERNAME')).to(emailUsers).subject(emailSubject).html(htmlRender)
          })
        } else if (Array.isArray(emailUsers)) {
          await Promise.all(
            emailUsers.map((emailUser: string) => {
              return mail.sendLater((message: Message): void => {
                message.from(env.get('MAIL_USERNAME')).to(emailUser).subject(emailSubject).html(htmlRender)
              })
            }),
          )
        }
      }
    } catch (err) {
      logger.error('Failed to send email : ', err)
      throw new InternalServerErrorException('Failed to send email')
    }
  }
}
