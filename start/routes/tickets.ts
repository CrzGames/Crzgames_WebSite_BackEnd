import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/ticket', [controllers.Tickets, 'createTickets'])
router.get('/ticket/:id', [controllers.Tickets, 'getTicketsById'])
router.get('/tickets', [controllers.Tickets, 'getAllTickets'])
router.get('/tickets/:userId', [controllers.Tickets, 'getAllTicketsByUserId'])
router.put('/tickets/:id', [controllers.Tickets, 'updateTicketByIdForStatus'])
router.get('/tickets-open-count/:userId', [controllers.Tickets, 'getTicketsCountByStatusOpenForUser'])
