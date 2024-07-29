import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'chat_friend_requests'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.integer('sender_users_id').unsigned().references('id').inTable('users')
      table.integer('receiver_users_id').unsigned().references('id').inTable('users')
      table.string('status').defaultTo('pending')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
