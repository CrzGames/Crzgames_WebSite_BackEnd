import router from '@adonisjs/core/services/router'
const GameChangeLogsController = () => import('#controllers/game_change_logs_controller')

router.post('/game-change-log', [GameChangeLogsController, 'createGameChangeLog'])
router.put('/game-change-log/:id', [GameChangeLogsController, 'updateGameChangeLog'])
router.delete('/game-change-log/:id', [GameChangeLogsController, 'deleteGameChangeLog'])
router.get('/game-change-logs', [GameChangeLogsController, 'getAllGameChangeLogs'])
router.get('/game-change-logs/game/:gameId', [GameChangeLogsController, 'getAllGameChangeLogByGameId'])
router.get('/game-change-log/:id', [GameChangeLogsController, 'getGameChangeLogById'])
router.get('/game-change-logs/game-title/:title', [GameChangeLogsController, 'getAllGameChangeLogByGameTitle'])
