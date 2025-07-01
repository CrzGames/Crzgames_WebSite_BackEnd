import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const UserRolesController = () => import('#controllers/user_roles_controller')

router.get('/user-roles', [UserRolesController, 'getAllUserRoles']).use([middleware.auth()])
