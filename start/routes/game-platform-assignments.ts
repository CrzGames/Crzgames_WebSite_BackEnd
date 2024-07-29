import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get(
    '/game/:gameId/platforms',
    'GamePlatformAssignmentsController.getAllGamePlatformAssignmentByGameId',
  )
  Route.get(
    '/game/platforms/:platformId',
    'GamePlatformAssignmentsController.getAllGamePlatformAssignmentByPlatformId',
  )
})
