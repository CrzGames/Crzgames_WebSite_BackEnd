import Route from '@ioc:Adonis/Core/Route'

Route.get('/chat-friends/:userId', 'ChatFriendController.getAllChatFriendByUserId')
Route.get(
  '/chat-friends/by-username/:username',
  'ChatFriendController.getAllChatFriendByUserUsername',
)
