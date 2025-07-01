import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const GameBinaryController = () => import('#controllers/game_binary_controller')

router.get('/game-binary/:id', [GameBinaryController, 'getGameBinaryById'])
router.post('/game-binary', [GameBinaryController, 'createGameBinary']).use([middleware.auth()])
router.put('/game-binary/:id', [GameBinaryController, 'updateGameBinary']).use([middleware.auth()])
router.delete('/game-binary/:id', [GameBinaryController, 'deleteGameBinary']).use([middleware.auth()])
