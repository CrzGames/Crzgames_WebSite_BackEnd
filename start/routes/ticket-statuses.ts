import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/ticket-statuses', [controllers.TicketStatuses, 'getAllTicketStatuses']).use([middleware.auth()])
