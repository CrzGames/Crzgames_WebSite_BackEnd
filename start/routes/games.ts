import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('/game', 'GamesController.createGames').middleware(['auth'])
  Route.get('/game/:id', 'GamesController.getGamesById')
  Route.get('/games/title/:title', 'GamesController.getAllGamesByTitle')
  Route.get('/game', 'GamesController.getGameByTitle')
  Route.get('/games', 'GamesController.getAllGames')
  Route.put('/game/:id', 'GamesController.updateGames').middleware(['auth'])
  Route.delete('/game/:id', 'GamesController.deleteGames').middleware(['auth'])
})
