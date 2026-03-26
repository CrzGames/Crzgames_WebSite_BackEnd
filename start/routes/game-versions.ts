import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router
  .post('/games/:gameId/versions', [controllers.GameVersions, 'createGameVersion'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router.get('/games/:gameId/versions', [controllers.GameVersions, 'getAllGameVersionsByGameId']).use(middleware.auth())
router
  .get('/games/versions', [controllers.GameVersions, 'getAllGameVersions'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .get('/games/:gameId/versions/:gameVersionId', [controllers.GameVersions, 'getGameVersion'])
  .use(middleware.auth())
router
  .put('/games/:gameId/versions/:gameVersionId', [controllers.GameVersions, 'updateGameVersion'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .delete('/games/:gameId/versions/:gameVersionId', [controllers.GameVersions, 'deleteGameVersion'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router.get('/games/:gameId/version-latest', [controllers.GameVersions, 'getLatestAvailableVersion']).use(
  middleware.auth(),
)
