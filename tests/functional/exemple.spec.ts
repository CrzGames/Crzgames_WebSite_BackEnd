import { test } from '@japa/runner'
import { ApiResponse } from '@japa/api-client'
import User from 'App/Models/User'

test.group('Exemple', (): void => {
  test('Connect and request HTTP middleware is active', async ({ client }): Promise<void> => {
    const user: User = await User.findOrFail(1)

    // Connect via @adonisjs/auth (api) and request http get
    // Documentation : https://docs.adonisjs.com/guides/testing/http-tests#authentication
    const response: ApiResponse = await client.get('/test').guard('api').loginAs(user)

    // Verify response Swagger
    // docs/swagger/test.yml -> route /test
    response.assertAgainstApiSpec()
  })
})
