import { HttpContext } from '@adonisjs/core/http'
import ChatFriendRequestService from '#services/chat_friend_request_service'
import ChatFriendRequest from '#models/chat_friend_request'

export default class ChatFriendRequestController {
  public async getAllChatFriendRequestByUserId({
    params,
    response,
  }: HttpContext): Promise<void> {
    const userId: number = params.userId
    const chatFriendRequests: ChatFriendRequest[] =
      await ChatFriendRequestService.getAllChatFriendRequestByUserId(userId)
    return response.status(200).ok(chatFriendRequests)
  }
}
