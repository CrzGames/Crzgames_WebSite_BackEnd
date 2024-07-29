import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('/game-change-log', 'GameChangeLogsController.createGameChangeLog')
  Route.put('/game-change-log/:id', 'GameChangeLogsController.updateGameChangeLog')
  Route.delete('/game-change-log/:id', 'GameChangeLogsController.deleteGameChangeLog')
  Route.get('/game-change-logs', 'GameChangeLogsController.getAllGameChangeLogs')
  Route.get(
    '/game-change-logs/game/:gameId',
    'GameChangeLogsController.getAllGameChangeLogByGameId',
  )
  Route.get('/game-change-log/:id', 'GameChangeLogsController.getGameChangeLogById')
  Route.get(
    '/game-change-logs/game-title/:title',
    'GameChangeLogsController.getAllGameChangeLogByGameTitle',
  )
})
