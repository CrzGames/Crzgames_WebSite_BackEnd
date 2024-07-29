import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get('/user-roles', 'UserRolesController.getAllUserRoles')
}).middleware(['auth'])
