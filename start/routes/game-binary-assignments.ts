import router from '@adonisjs/core/services/router'
const GameBinaryAssignmentsController = () => import('#controllers/game_binary_assignments_controller')

router.group((): void => {
  router.get('/game/:gameId/binaries', [GameBinaryAssignmentsController, 'getAllGameBinaryAssignmentByGameId'])
})
