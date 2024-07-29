import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'carousels'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('image_files_id').unsigned().references('id').inTable('files').notNullable()
      table.integer('logo_files_id').unsigned().references('id').inTable('files').nullable()
      table.string('title').nullable()
      table.string('content').nullable()
      table.string('button_url').nullable()
      table.string('button_content').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
