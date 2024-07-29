import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get(
    '/game/:gameId/binaries',
    'GameBinaryAssignmentsController.getAllGameBinaryAssignmentByGameId',
  )
})
