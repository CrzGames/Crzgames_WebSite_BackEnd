import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router.post('/ticket', [controllers.Tickets, 'createTickets']).use(middleware.auth())
router.get('/ticket/:id', [controllers.Tickets, 'getTicketsById']).use(middleware.auth())
router
  .get('/tickets', [controllers.Tickets, 'getAllTickets'])
  .use(middleware.authRole([UserRoles.MODERATOR, UserRoles.STAFF, UserRoles.ADMIN]))
router.get('/tickets/:userId', [controllers.Tickets, 'getAllTicketsByUserId']).use(middleware.auth())
router.put('/tickets/:id', [controllers.Tickets, 'updateTicketByIdForStatus']).use(middleware.auth())
router
  .get('/tickets-open-count/:userId', [controllers.Tickets, 'getTicketsCountByStatusOpenForUser'])
  .use(middleware.auth())
