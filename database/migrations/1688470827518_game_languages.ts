import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'game_languages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable().unique()
      table
        .integer('games_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('games')
        .onDelete('CASCADE')
      table
        .integer('languages_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('languages')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
