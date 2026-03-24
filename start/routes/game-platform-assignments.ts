import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/game/:gameId/platforms', [controllers.GamePlatformAssignments, 'getAllGamePlatformAssignmentByGameId'])
router.get('/game/platforms/:platformId', [
  controllers.GamePlatformAssignments,
  'getAllGamePlatformAssignmentByPlatformId',
])
