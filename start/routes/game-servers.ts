import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get('/game-servers', 'GameServerController.getAllGameServers')
  Route.post('/game-servers', 'GameServerController.createGameServer')
}).middleware('auth')
