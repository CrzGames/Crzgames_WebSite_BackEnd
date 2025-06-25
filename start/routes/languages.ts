import router from '@adonisjs/core/services/router'
const LanguagesController = () => import('#controllers/languages_controller')

router.get('/languages', [LanguagesController, 'getAllLanguages'])
