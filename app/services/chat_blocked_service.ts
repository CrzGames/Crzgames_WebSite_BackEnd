import NotFoundException from '#exceptions/not_found_exception'
import ChatBlocked from '#models/chat_blocked'

export default class ChatBlockedService {
  public static async checkIfUserSenderBlocked(senderUserId: number, receiverUserId: number): Promise<boolean> {
    try {
      await ChatBlocked.query()
        .where('blocker_users_id', receiverUserId)
        .andWhere('blocked_users_id', senderUserId)
        .firstOrFail()

      return true
    } catch (error) {
      new NotFoundException(error.message)
      return false
    }
  }
}
