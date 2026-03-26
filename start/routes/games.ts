import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router.post('/game', [controllers.Games, 'createGames']).use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router.get('/game/:id', [controllers.Games, 'getGamesById'])
router.get('/games/title/:title', [controllers.Games, 'getAllGamesByTitle'])
router.get('/game', [controllers.Games, 'getGameByTitle'])
router.get('/games', [controllers.Games, 'getAllGames'])
router.put('/game/:id', [controllers.Games, 'updateGames']).use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .delete('/game/:id', [controllers.Games, 'deleteGames'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
