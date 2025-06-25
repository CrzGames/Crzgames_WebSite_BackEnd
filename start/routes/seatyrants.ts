import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const SeatyrantsController = () => import('#controllers/seatyrants_controller')

router
  .group(() => {
    router.get('/seatyrants/info-user', [SeatyrantsController, 'getInfoUser'])
  })
  .use(middleware.restrictCorsToSeatyrants())
