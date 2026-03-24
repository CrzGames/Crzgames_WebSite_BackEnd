import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.put('/maintenance-websites/is-maintenance', [controllers.MaintenanceWebSite, 'updateIsMaintenance'])
router.get('/maintenance-websites/is-maintenance', [controllers.MaintenanceWebSite, 'isMaintenance'])
