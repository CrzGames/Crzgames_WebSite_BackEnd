import Route from '@ioc:Adonis/Core/Route'

Route.post('/games/:gameId/versions', 'GameVersionsController.createGameVersion')
Route.get('/games/:gameId/versions', 'GameVersionsController.getAllGameVersionsByGameId')
Route.get('/games/versions', 'GameVersionsController.getAllGameVersions')
Route.get('/games/:gameId/versions/:gameVersionId', 'GameVersionsController.getGameVersion')
Route.put('/games/:gameId/versions/:gameVersionId', 'GameVersionsController.updateGameVersion')
Route.delete('/games/:gameId/versions/:gameVersionId', 'GameVersionsController.deleteGameVersion')
Route.get('/games/:gameId/version-latest', 'GameVersionsController.getLatestAvailableVersion')
