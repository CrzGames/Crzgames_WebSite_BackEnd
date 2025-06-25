import router from '@adonisjs/core/services/router'
const ChatFriendController = () => import('#controllers/chat_friend_controller')

router.get('/chat-friends/:userId', [ChatFriendController, 'getAllChatFriendByUserId'])
router.get('/chat-friends/by-username/:username', [ChatFriendController, 'getAllChatFriendByUserUsername'])
