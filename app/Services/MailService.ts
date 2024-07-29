import Mail, { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'
import View from '@ioc:Adonis/Core/View'
import mjml from 'mjml'
import Mailjet, { LibraryResponse, Request } from 'node-mailjet'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'
import Logger from '@ioc:Adonis/Core/Logger'
import { RequestData } from 'node-mailjet/declarations/request/Request'

export default class MailService extends BaseMailer {
  public static async sendMail(
    emailUsers: string[] | string,
    viewEmail: string,
    data: any,
    emailSubject: string,
  ): Promise<void> {
    try {
      const viewRender: string = await View.render('emails/' + viewEmail, data)
      const htmlRender: string = mjml(viewRender).html

      // use MailJet for environment staging and production
      if (Env.get('NODE_ENV') !== 'test' && Env.get('NODE_ENV') !== 'development') {
        const mailjet: Mailjet = new Mailjet({
          apiKey: Env.get('MAILJET_API_KEY'),
          apiSecret: Env.get('MAILJET_API_SECRET_KEY'),
        })

        const toRecipients = Array.isArray(emailUsers)
          ? emailUsers.map((email) => ({ Email: email }))
          : [{ Email: emailUsers }]

        const request: Promise<LibraryResponse<RequestData>> = mailjet
          .post('send', { version: Env.get('MAIJET_API_VERSION') })
          .request({
            Messages: [
              {
                From: {
                  Email: Env.get('MAIL_USERNAME'),
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
            Logger.log('MAILJET POST THEN : ', JSON.stringify(result))
          })
          .catch((error: any): void => {
            Logger.error('MAILJET POST CATCH : ', error)
          })
      }

      // use SMTP protocol to environment develop
      // Pushed to in-memory queue
      else {
        if (typeof emailUsers === 'string') {
          await Mail.sendLater((message: MessageContract): void => {
            message
              .from(Env.get('MAIL_USERNAME'))
              .to(emailUsers)
              .subject(emailSubject)
              .html(htmlRender)
          })
        } else if (Array.isArray(emailUsers)) {
          await Promise.all(
            emailUsers.map((emailUser: string) => {
              return Mail.sendLater((message: MessageContract): void => {
                message
                  .from(Env.get('MAIL_USERNAME'))
                  .to(emailUser)
                  .subject(emailSubject)
                  .html(htmlRender)
              })
            }),
          )
        }
      }
    } catch (err) {
      Logger.error('Failed to send email : ', err)
      throw new InternalServerErrorException('Failed to send email')
    }
  }
}
