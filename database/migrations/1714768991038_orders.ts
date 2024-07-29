import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName: string = 'orders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('users_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.decimal('total_price', 10, 2).notNullable()
      table.string('currency').notNullable() // Devise monétaire de la transaction
      table.string('status_order').notNullable() // Statut de la commande
      table.string('payment_intent_id').unique().nullable() // Identifiant de l'intention de paiement unique
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
