import router from '@adonisjs/core/services/router'
const NatsController = () => import('#controllers/nats_controller')

router.post('/publish', [NatsController, 'publish'])
router.post('/subscribe', [NatsController, 'subscribe'])
