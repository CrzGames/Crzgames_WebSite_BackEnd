import router from '@adonisjs/core/services/router'
const ChatFriendRequestController = () => import('#controllers/chat_friend_request_controller')

router.get('/chat-friend-requests/:userId', [ChatFriendRequestController, 'getAllChatFriendRequestByUserId'])
