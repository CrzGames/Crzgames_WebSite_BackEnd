import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const TicketResponsesController = () => import('#controllers/ticket_responses_controller')

router
  .group((): void => {
    router.post('/ticket-response', [TicketResponsesController, 'createTicketResponses'])
    router.get('/ticket-response/:ticketId', [TicketResponsesController, 'getAllTicketsResponsesByTicketId'])
  })
  .use([middleware.auth()])
