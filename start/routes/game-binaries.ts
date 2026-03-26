import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router.get('/game-binary/:id', [controllers.GameBinary, 'getGameBinaryById']).use(middleware.auth())
router
  .post('/game-binary', [controllers.GameBinary, 'createGameBinary'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .put('/game-binary/:id', [controllers.GameBinary, 'updateGameBinary'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .delete('/game-binary/:id', [controllers.GameBinary, 'deleteGameBinary'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
