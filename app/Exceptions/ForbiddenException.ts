import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export class ForbiddenException extends Exception {
  constructor(message: string = 'Forbidden', status: number = 403) {
    super(message, status)
  }

  public async handle(error: this, ctx: HttpContextContract): Promise<void> {
    ctx.response.status(error.status).send(error.message)
  }

  public report(error: this): void {
    Logger.warn(`ForbiddenException: ${error.message}`)
  }
}
