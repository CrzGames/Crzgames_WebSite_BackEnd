import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { BadRequestException } from 'App/Exceptions/BadRequestException'
import { UnauthorizedException } from 'App/Exceptions/UnauthorizedException'
import { ForbiddenException } from 'App/Exceptions/ForbiddenException'
import { NotFoundException } from 'App/Exceptions/NotFoundException'
import { InternalServerErrorException } from 'App/Exceptions/InternalServerErrorException'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send(error.messages)
    }

    // Call the report method on custom exceptions
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException ||
      error instanceof ForbiddenException ||
      error instanceof NotFoundException ||
      error instanceof InternalServerErrorException
    ) {
      error.report(error)
    }

    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx)
  }
}
