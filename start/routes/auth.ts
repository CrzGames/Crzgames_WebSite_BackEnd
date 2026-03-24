import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.post('/signup', [controllers.Auth, 'signUp'])
router.post('/signin', [controllers.Auth, 'signIn'])
router.post('/signout', [controllers.Auth, 'signOut']).use(middleware.auth())
router.post('/verify', [controllers.Auth, 'verifyCode'])
router.post('/forgot-password', [controllers.Auth, 'forgotPassword'])
router.post('/reset-password', [controllers.Auth, 'resetPassword'])
router.post('/modify-email', [controllers.Auth, 'sendMailToModifyEmail'])
router.post('/reset-email', [controllers.Auth, 'resetEmail'])
router.post('/resend-code', [controllers.Auth, 'resendNewCodeVerificationAccount'])
