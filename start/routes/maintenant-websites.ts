import router from '@adonisjs/core/services/router'
const MaintenanceWebSiteController = () => import('#controllers/maintenance_web_site_controller')

router.put('/maintenance-websites/is-maintenance', [MaintenanceWebSiteController, 'updateIsMaintenance'])
router.get('/maintenance-websites/is-maintenance', [MaintenanceWebSiteController, 'isMaintenance'])
