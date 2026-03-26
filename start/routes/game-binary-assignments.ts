import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.get('/game/:gameId/binaries', [controllers.GameBinaryAssignments, 'getAllGameBinaryAssignmentByGameId']).use(
  middleware.auth(),
)
