import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get(
    '/user-game-libraries/:userId',
    'UserGameLibrariesController.getAllUsersGamesLibrariesByUserId',
  )
  Route.post('/user-game-libraries', 'UserGameLibrariesController.addGameToUserLibrary')
}).middleware(['auth'])
