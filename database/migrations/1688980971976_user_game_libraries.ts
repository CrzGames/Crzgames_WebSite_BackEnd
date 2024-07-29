import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'user_game_libraries'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.integer('users_id').unsigned().references('id').inTable('users')
      table.integer('games_id').unsigned().references('id').inTable('games')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
