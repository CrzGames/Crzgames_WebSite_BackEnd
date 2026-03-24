import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group((): void => {
    router.post('/ticket-response', [controllers.TicketResponses, 'createTicketResponses'])
    router.get('/ticket-response/:ticketId', [controllers.TicketResponses, 'getAllTicketsResponsesByTicketId'])
  })
  .use([middleware.auth()])
