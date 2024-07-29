import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreatePaymentIntentValidator {
  public schema = schema.array().members(
    schema.object().members({
      products_id: schema.number([
        rules.required(),
        rules.exists({ table: 'products', column: 'id' }), // Vérifiez que le produit existe
      ]),
      quantity: schema.number([rules.required()]),
      game_servers_id: schema.number.optional([
        rules.exists({ table: 'game_servers', column: 'id' }), // Vérifiez que le serveur de jeu existe, s'il est fourni
      ]),
    }),
  )

  public messages = {
    required: 'Ce champ est requis.',
    '*.products_id.required': 'Un ID de produit valide est requis pour chaque commande.',
    '*.products_id.exists': 'Le produit doit exister.',
    '*.quantity.required': 'La quantité pour chaque produit est requise.',
    '*.game_servers_id.exists': 'Le serveur de jeu spécifié doit exister, s’il est fourni.',
  }
}
