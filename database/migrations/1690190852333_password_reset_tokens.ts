import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'password_reset_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.integer('users_id').unsigned().references('id').inTable('users')
      table.string('token').notNullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
