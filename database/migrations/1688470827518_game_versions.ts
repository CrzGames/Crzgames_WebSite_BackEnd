import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'game_versions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('games_id').unsigned().references('id').inTable('games').onDelete('CASCADE')
      table.text('version').notNullable()
      table.boolean('is_available').notNullable().defaultTo(false)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
