import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router.post('/publish', [controllers.Nats, 'publish']).use(middleware.authRole([UserRoles.ADMIN]))
router.post('/subscribe', [controllers.Nats, 'subscribe']).use(middleware.authRole([UserRoles.ADMIN]))
