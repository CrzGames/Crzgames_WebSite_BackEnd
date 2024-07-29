import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get(
    '/game/:gameId/categories',
    'GameCategoryAssignmentsController.getAllGameCategoryAssignmentByGameId',
  )
  Route.get(
    '/game/categories/:categoryId',
    'GameCategoryAssignmentsController.getAllGameCategoryAssignmentByCategoryId',
  )
})
