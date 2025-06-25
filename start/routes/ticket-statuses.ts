import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const TicketStatusesController = () => import('#controllers/ticket_statuses_controller')

router
  .group((): void => {
    router.get('/ticket-statuses', [TicketStatusesController, 'getAllTicketStatuses'])
  })
  .use([middleware.auth()])
