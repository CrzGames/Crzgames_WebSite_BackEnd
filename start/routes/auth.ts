import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.post('/signup', 'AuthController.signUp')
  Route.post('/signin', 'AuthController.signIn')
  Route.post('/signout', 'AuthController.signOut')
  Route.post('/verify', 'AuthController.verifyCode')
  Route.post('/forgot-password', 'AuthController.forgotPassword')
  Route.post('/reset-password', 'AuthController.resetPassword')
  Route.post('/modify-email', 'AuthController.sendMailToModifyEmail')
  Route.post('/reset-email', 'AuthController.resetEmail')
  Route.post('/resend-code', 'AuthController.resendNewCodeVerificationAccount')
})
