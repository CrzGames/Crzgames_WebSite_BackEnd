import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'tickets'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.integer('ticket_statuses_id').unsigned().references('id').inTable('ticket_statuses')
      table.integer('users_id').unsigned().references('id').inTable('users')
      table.integer('ticket_categories_id').unsigned().references('id').inTable('ticket_categories')
      table.text('subject').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
