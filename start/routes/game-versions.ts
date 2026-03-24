import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/games/:gameId/versions', [controllers.GameVersions, 'createGameVersion'])
router.get('/games/:gameId/versions', [controllers.GameVersions, 'getAllGameVersionsByGameId'])
router.get('/games/versions', [controllers.GameVersions, 'getAllGameVersions'])
router.get('/games/:gameId/versions/:gameVersionId', [controllers.GameVersions, 'getGameVersion'])
router.put('/games/:gameId/versions/:gameVersionId', [controllers.GameVersions, 'updateGameVersion'])
router.delete('/games/:gameId/versions/:gameVersionId', [controllers.GameVersions, 'deleteGameVersion'])
router.get('/games/:gameId/version-latest', [controllers.GameVersions, 'getLatestAvailableVersion'])
