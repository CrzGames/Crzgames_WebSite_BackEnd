import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router
  .put('/maintenance-websites/is-maintenance', [controllers.MaintenanceWebSite, 'updateIsMaintenance'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router.get('/maintenance-websites/is-maintenance', [controllers.MaintenanceWebSite, 'isMaintenance'])
