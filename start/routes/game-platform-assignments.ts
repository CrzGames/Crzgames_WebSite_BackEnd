import router from '@adonisjs/core/services/router'
const GamePlatformAssignmentsController = () => import('#controllers/game_platform_assignments_controller')

router.get('/game/:gameId/platforms', [GamePlatformAssignmentsController, 'getAllGamePlatformAssignmentByGameId'])
router.get('/game/platforms/:platformId', [
  GamePlatformAssignmentsController,
  'getAllGamePlatformAssignmentByPlatformId',
])
