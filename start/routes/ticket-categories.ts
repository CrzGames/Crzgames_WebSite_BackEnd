import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const TicketCategoriesController = () => import('#controllers/ticket_categories_controller')

router
  .group((): void => {
    router.get('/ticket-categories', [TicketCategoriesController, 'getAllTicketCategories'])
  })
  .use([middleware.auth()])
