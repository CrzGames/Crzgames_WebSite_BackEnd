import ChatMessage from '#models/chat_message'
import BadRequestException from '#exceptions/bad_request_exception'

class ChatMessageService {
  public async createChatMessage(
    senderUserId: number,
    receiverUserId: number,
    content: string,
  ): Promise<ChatMessage | undefined> {
    try {
      return await ChatMessage.create({
        sender_users_id: senderUserId,
        receiver_users_id: receiverUserId,
        content: content,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
