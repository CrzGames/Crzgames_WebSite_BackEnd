import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/publish', [controllers.Nats, 'publish'])
router.post('/subscribe', [controllers.Nats, 'subscribe'])
