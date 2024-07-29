import Route from '@ioc:Adonis/Core/Route'

Route.put(
  '/maintenance-websites/is-maintenance',
  'MaintenanceWebSiteController.updateIsMaintenance',
)
Route.get('/maintenance-websites/is-maintenance', 'MaintenanceWebSiteController.isMaintenance')
