import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'ticket_responses'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.integer('tickets_id').unsigned().references('id').inTable('tickets')
      table.integer('users_id').unsigned().references('id').inTable('users')
      table.text('content').notNullable()
      table.boolean('is_support').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
