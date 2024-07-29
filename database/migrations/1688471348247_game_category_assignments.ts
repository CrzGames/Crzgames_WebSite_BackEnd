import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'game_category_assignments'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.integer('games_id').unsigned().references('id').inTable('games').onDelete('CASCADE')
      table.integer('game_categories_id').unsigned().references('id').inTable('game_categories')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
