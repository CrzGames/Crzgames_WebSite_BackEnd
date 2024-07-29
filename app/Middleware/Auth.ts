import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class AuthMiddleware {
  protected redirectTo: string = '/api/auth/login'

  protected async authenticate(
    auth: HttpContextContract['auth'],
    guards: (keyof GuardsList)[],
  ): Promise<boolean> {
    let guardLastAttempted: string | undefined
    for (let guard of guards) {
      guardLastAttempted = guard

      if (await auth.use(guard).check()) {
        auth.defaultGuard = guard
        return true
      }
    }

    throw new AuthenticationException(
      'Unauthorized access',
      'E_UNAUTHORIZED_ACCESS',
      guardLastAttempted,
      this.redirectTo,
    )
  }

  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    customGuards: (keyof GuardsList)[],
  ): Promise<void> {
    const guards = customGuards.length ? customGuards : [auth.name]
    await this.authenticate(auth, guards)
    await next()
  }
}
