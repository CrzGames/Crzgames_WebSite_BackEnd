import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.integer('image_files_id').unsigned().references('id').inTable('files')
      table.integer('games_id').unsigned().nullable().references('id').inTable('games')
      table
        .integer('product_categories_id')
        .unsigned()
        .references('id')
        .inTable('product_categories')
        .onDelete('SET NULL')
      table.decimal('price', 10, 2).notNullable() // Prix en euros unitaire
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
