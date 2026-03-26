import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router
  .group((): void => {
    router.get('/user', [controllers.Users, 'decodeTokenReturnUser'])
    router.get('/user/sensitive-data', [controllers.Users, 'getVarsEnvironmentForUser'])
    router.get('/user/:id', [controllers.Users, 'getUsersById'])
    router
      .get('/users', [controllers.Users, 'getAllUsers'])
      .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
    router
      .get('/users/by-username-or-email/:usernameOrEmail', [controllers.Users, 'getAllUsersByUsernameOrEmail'])
      .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
    router.put('/user/:id', [controllers.Users, 'updateUsers'])
    router
      .delete('/user/:id', [controllers.Users, 'deleteUsers'])
      .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
    router
      .put('/user/:userId/role/:roleId', [controllers.Users, 'updateUsersRole'])
      .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
  })
  .use(middleware.auth())
