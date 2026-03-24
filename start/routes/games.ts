import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/game', [controllers.Games, 'createGames']).use([middleware.auth()])
router.get('/game/:id', [controllers.Games, 'getGamesById'])
router.get('/games/title/:title', [controllers.Games, 'getAllGamesByTitle'])
router.get('/game', [controllers.Games, 'getGameByTitle'])
router.get('/games', [controllers.Games, 'getAllGames'])
router.put('/game/:id', [controllers.Games, 'updateGames']).use([middleware.auth()])
router.delete('/game/:id', [controllers.Games, 'deleteGames']).use([middleware.auth()])
