import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'maintenance_web_sites'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table): void => {
      table.increments('id').primary()
      table.string('name').notNullable().unique()
      table.boolean('is_maintenance').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
