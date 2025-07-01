import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const GamesController = () => import('#controllers/games_controller')

router.post('/game', [GamesController, 'createGames']).use([middleware.auth()])
router.get('/game/:id', [GamesController, 'getGamesById'])
router.get('/games/title/:title', [GamesController, 'getAllGamesByTitle'])
router.get('/game', [GamesController, 'getGameByTitle'])
router.get('/games', [GamesController, 'getAllGames'])
router.put('/game/:id', [GamesController, 'updateGames']).use([middleware.auth()])
router.delete('/game/:id', [GamesController, 'deleteGames']).use([middleware.auth()])
