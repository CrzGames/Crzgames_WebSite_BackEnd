import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/game-change-log', [controllers.GameChangeLogs, 'createGameChangeLog'])
router.put('/game-change-log/:id', [controllers.GameChangeLogs, 'updateGameChangeLog'])
router.delete('/game-change-log/:id', [controllers.GameChangeLogs, 'deleteGameChangeLog'])
router.get('/game-change-logs', [controllers.GameChangeLogs, 'getAllGameChangeLogs'])
router.get('/game-change-logs/game/:gameId', [controllers.GameChangeLogs, 'getAllGameChangeLogByGameId'])
router.get('/game-change-log/:id', [controllers.GameChangeLogs, 'getGameChangeLogById'])
router.get('/game-change-logs/game-title/:title', [controllers.GameChangeLogs, 'getAllGameChangeLogByGameTitle'])
