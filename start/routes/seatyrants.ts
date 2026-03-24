import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('/seatyrants/info-user', [controllers.Seatyrants, 'getInfoUser'])
  })
  .use(middleware.restrictCorsToSeatyrants())
