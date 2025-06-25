import router from '@adonisjs/core/services/router'
const GameVersionsController = () => import('#controllers/game_versions_controller')

router.post('/games/:gameId/versions', [GameVersionsController, 'createGameVersion'])
router.get('/games/:gameId/versions', [GameVersionsController, 'getAllGameVersionsByGameId'])
router.get('/games/versions', [GameVersionsController, 'getAllGameVersions'])
router.get('/games/:gameId/versions/:gameVersionId', [GameVersionsController, 'getGameVersion'])
router.put('/games/:gameId/versions/:gameVersionId', [GameVersionsController, 'updateGameVersion'])
router.delete('/games/:gameId/versions/:gameVersionId', [GameVersionsController, 'deleteGameVersion'])
router.get('/games/:gameId/version-latest', [GameVersionsController, 'getLatestAvailableVersion'])
