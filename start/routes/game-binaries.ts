import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/game-binary/:id', [controllers.GameBinary, 'getGameBinaryById'])
router.post('/game-binary', [controllers.GameBinary, 'createGameBinary']).use([middleware.auth()])
router.put('/game-binary/:id', [controllers.GameBinary, 'updateGameBinary']).use([middleware.auth()])
router.delete('/game-binary/:id', [controllers.GameBinary, 'deleteGameBinary']).use([middleware.auth()])
