import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/ticket-categories', [controllers.TicketCategories, 'getAllTicketCategories']).use([middleware.auth()])
