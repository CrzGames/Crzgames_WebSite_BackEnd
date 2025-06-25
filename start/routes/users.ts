import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')

router
  .group((): void => {
    router.get('/user', [UsersController, 'decodeTokenReturnUser'])
    // Get les variable d'environnement sensible pour le user lorsqu'il est connecté
    router.get('/user/sensitive-data', [UsersController, 'getVarsEnvironmentForUser'])
    router.get('/user/:id', [UsersController, 'getUsersById'])
    router.get('/users', [UsersController, 'getAllUsers'])
    router.get('/users/by-username-or-email/:usernameOrEmail', [UsersController, 'getAllUsersByUsernameOrEmail'])
    router.put('/user/:id', [UsersController, 'updateUsers'])
    router.delete('/user/:id', [UsersController, 'deleteUsers'])
    router.put('/user/:userId/role/:roleId', [UsersController, 'updateUsersRole'])
  })
  .use(middleware.auth())
