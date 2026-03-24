import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.get('/user', [controllers.Users, 'decodeTokenReturnUser'])
    router.get('/user/sensitive-data', [controllers.Users, 'getVarsEnvironmentForUser'])
    router.get('/user/:id', [controllers.Users, 'getUsersById'])
    router.get('/users', [controllers.Users, 'getAllUsers'])
    router.get('/users/by-username-or-email/:usernameOrEmail', [controllers.Users, 'getAllUsersByUsernameOrEmail'])
    router.put('/user/:id', [controllers.Users, 'updateUsers'])
    router.delete('/user/:id', [controllers.Users, 'deleteUsers'])
    router.put('/user/:userId/role/:roleId', [controllers.Users, 'updateUsersRole'])
  })
  .use(middleware.auth())
