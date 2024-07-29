import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Knex } from 'knex'
import CreateTableBuilder = Knex.CreateTableBuilder

export default class extends BaseSchema {
  protected tableName: string = 'files'

  public async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table: CreateTableBuilder): void => {
      table.increments('id').primary()
      table.integer('buckets_id').unsigned().references('id').inTable('buckets')
      table.string('pathfilename').notNullable()
      table.string('url').notNullable()
      table.integer('size').notNullable() // in bytes
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down(): Promise<void> {
    this.schema.dropTable(this.tableName)
  }
}
