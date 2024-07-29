import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'game_platforms'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.string('name').notNullable().unique()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
