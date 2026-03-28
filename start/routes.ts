import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from '#start/kernel'
import type { Route } from '@adonisjs/core/http'

/**
 * Routes système
 */
import './routes/swagger.js'
import './routes/health.js'

/**
 * Routes métiers
 */
import './routes/auth.js'
import './routes/carousel.js'
import './routes/cloud-storage-s3.js'
import './routes/game-binaries.js'
import './routes/game-binary-assignments.js'
import './routes/game-categories.js'
import './routes/game-category-assignments.js'
import './routes/game-change-logs.js'
import './routes/game-platform-assignments.js'
import './routes/game-platforms.js'
import './routes/games.js'
import './routes/game-servers.js'
import './routes/game-versions.js'
import './routes/languages.js'
import './routes/launcher.js'
import './routes/maintenant-websites.js'
import './routes/nats.js'
import './routes/order-products.js'
import './routes/orders.js'
import './routes/product-categories.js'
import './routes/product-discounts.js'
import './routes/product-game-servers.js'
import './routes/products.js'
import './routes/seatyrants.js'
import './routes/stripe.js'
import './routes/ticket-categories.js'
import './routes/ticket-responses.js'
import './routes/tickets.js'
import './routes/ticket-statuses.js'
import './routes/user-game-libraries.js'
import './routes/user-roles.js'
import './routes/users.js'

/**
 * Routes Transmit (SSE)
 */
transmit.registerRoutes((route: Route<any>): void => {
  // EventSource (GET /__transmit/events) ne peut pas envoyer le header Authorization.
  // On protege uniquement subscribe/unsubscribe qui passent via fetch avec header Bearer.
  if (route.getPattern() !== '__transmit/events') {
    route.middleware(middleware.auth())
  }
})

/**
 * Cette route est utilisée pour tester le fonctionnement de base de l'application.
 */
router.get('/', async (): Promise<{ hello: string }> => {
  return {
    hello: 'test',
  }
})
