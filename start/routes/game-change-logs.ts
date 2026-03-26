import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router
  .post('/game-change-log', [controllers.GameChangeLogs, 'createGameChangeLog'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .put('/game-change-log/:id', [controllers.GameChangeLogs, 'updateGameChangeLog'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .delete('/game-change-log/:id', [controllers.GameChangeLogs, 'deleteGameChangeLog'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router.get('/game-change-logs', [controllers.GameChangeLogs, 'getAllGameChangeLogs'])
router.get('/game-change-logs/game/:gameId', [controllers.GameChangeLogs, 'getAllGameChangeLogByGameId'])
router.get('/game-change-log/:id', [controllers.GameChangeLogs, 'getGameChangeLogById'])
router.get('/game-change-logs/game-title/:title', [controllers.GameChangeLogs, 'getAllGameChangeLogByGameTitle'])
