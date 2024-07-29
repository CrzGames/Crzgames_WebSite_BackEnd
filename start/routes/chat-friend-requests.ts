import Route from '@ioc:Adonis/Core/Route'

Route.get(
  '/chat-friend-requests/:userId',
  'ChatFriendRequestController.getAllChatFriendRequestByUserId',
)
