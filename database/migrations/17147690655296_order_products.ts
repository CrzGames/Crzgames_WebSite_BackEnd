import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'order_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('orders_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
      table
        .integer('products_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table
        .integer('game_servers_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable('game_servers')
        .onDelete('CASCADE')
      table.integer('quantity').notNullable().defaultTo(1)
      table.decimal('price', 10, 2).notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
