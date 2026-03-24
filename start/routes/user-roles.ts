import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/user-roles', [controllers.UserRoles, 'getAllUserRoles']).use([middleware.auth()])
