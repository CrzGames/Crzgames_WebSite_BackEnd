import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const HealthController = () => import('#controllers/health_controller')

/**
 * Vérifie l'état de santé de l'application
 */
router.get('/health', [HealthController]).use(middleware.health())
