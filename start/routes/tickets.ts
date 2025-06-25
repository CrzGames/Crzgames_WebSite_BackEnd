import router from '@adonisjs/core/services/router'
const TicketsController = () => import('#controllers/tickets_controller')

router.group((): void => {
  router.post('/ticket', [TicketsController, 'createTickets'])
  router.get('/ticket/:id', [TicketsController, 'getTicketsById'])
  router.get('/tickets', [TicketsController, 'getAllTickets'])
  router.get('/tickets/:userId', [TicketsController, 'getAllTicketsByUserId'])
  router.put('/tickets/:id', [TicketsController, 'updateTicketByIdForStatus'])
  router.get('/tickets-open-count/:userId', [TicketsController, 'getTicketsCountByStatusOpenForUser'])
})
