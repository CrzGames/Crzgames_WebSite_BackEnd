import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get('/user', 'UsersController.decodeTokenReturnUser')
  // Get les variable d'environnement sensible pour le user lorsqu'il est connecté
  Route.get('/user/sensitive-data', 'UsersController.getVarsEnvironmentForUser')
  Route.get('/user/:id', 'UsersController.getUsersById')
  Route.get('/users', 'UsersController.getAllUsers')
  Route.get(
    '/users/by-username-or-email/:usernameOrEmail',
    'UsersController.getAllUsersByUsernameOrEmail',
  )
  Route.put('/user/:id', 'UsersController.updateUsers')
  Route.delete('/user/:id', 'UsersController.deleteUsers')
  Route.put('/user/:userId/role/:roleId', 'UsersController.updateUsersRole')
}).middleware('auth')
