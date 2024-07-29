import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export class UnauthorizedException extends Exception {
  constructor(message: string = 'Unauthorized', status: number = 401) {
    super(message, status)
  }

  public async handle(error: this, ctx: HttpContextContract): Promise<void> {
    ctx.response.status(error.status).send(error.message)
  }

  public report(error: this): void {
    Logger.warn(`UnauthorizedException: ${error.message}`)
  }
}
