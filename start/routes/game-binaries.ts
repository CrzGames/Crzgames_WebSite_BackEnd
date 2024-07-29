import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get('/game-binary/:id', 'GameBinaryController.getGameBinaryById')
  Route.post('/game-binary', 'GameBinaryController.createGameBinary').middleware(['auth'])
  Route.put('/game-binary/:id', 'GameBinaryController.updateGameBinary').middleware(['auth'])
  Route.delete('/game-binary/:id', 'GameBinaryController.deleteGameBinary').middleware(['auth'])
})
