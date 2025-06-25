import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')

router.group((): void => {
  router.post('/signup', [AuthController, 'signUp'])
  router.post('/signin', [AuthController, 'signIn'])
  router.post('/signout', [AuthController, 'signOut'])
  router.post('/verify', [AuthController, 'verifyCode'])
  router.post('/forgot-password', [AuthController, 'forgotPassword'])
  router.post('/reset-password', [AuthController, 'resetPassword'])
  router.post('/modify-email', [AuthController, 'sendMailToModifyEmail'])
  router.post('/reset-email', [AuthController, 'resetEmail'])
  router.post('/resend-code', [AuthController, 'resendNewCodeVerificationAccount'])
})
