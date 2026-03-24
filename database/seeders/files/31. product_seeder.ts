import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'
import GameServer from '#models/game_server'
import ProductDiscount from '#models/product_discount'
import path from 'path'
import CloudStorageS3Service from '#services/cloud_storage_s3_service'
import File from '#models/file'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    const assetsBasePath: string = path.resolve('database/seeders/assets-bucket-s3/ProductSeeder/')
    const assetsBasePath2: string = path.resolve('database/seeders/assets-bucket-s3/GameSeeder/')
    const bucketNameBase: string = 'crzgames-public'

    const gameServer1: GameServer = await GameServer.create({
      name: 'Europe Global 1',
      region: 'Europe',
    })

    const gameServer2: GameServer = await GameServer.create({
      name: 'Private Test',
      region: 'Europe',
    })

    const products = [
      {
        name: '500 Emerald',
        description:
          'Découvrez les émeraudes magiques, la monnaie premium de SeaTyrants, utilisable pour améliorer vos navires, accéder à des équipements exclusifs. Nos émeraudes vous permettront de naviguer avec prestige et puissance à travers les mers tumultueuses du jeu. Recevez 500 Emerald à dépenser au marcher noir !',
        price: 5.0,
        games_id: 1,
        gameServers: [gameServer1.id, gameServer2.id],
        imagePath: path.join(assetsBasePath, 'emerald.webp'),
        discounts: [
          { currency: 'TRY', discount_percent: 50 },
          { currency: 'BRL', discount_percent: 35 },
        ],
        product_categories_id: 1,
      },
      {
        name: '1000 Emerald',
        description:
          'Découvrez les émeraudes magiques, la monnaie premium de SeaTyrants, utilisable pour améliorer vos navires, accéder à des équipements exclusifs. Nos émeraudes vous permettront de naviguer avec prestige et puissance à travers les mers tumultueuses du jeu. Recevez 1000 Emerald à dépenser au marcher noir !',
        price: 10.0,
        games_id: 1,
        gameServers: [gameServer1.id, gameServer2.id],
        imagePath: path.join(assetsBasePath, 'emerald.webp'),
        discounts: [
          { currency: 'TRY', discount_percent: 50 },
          { currency: 'BRL', discount_percent: 35 },
        ],
        product_categories_id: 1,
      },
      {
        name: '2600 Emerald',
        description:
          'Découvrez les émeraudes magiques, la monnaie premium de SeaTyrants, utilisable pour améliorer vos navires, accéder à des équipements exclusifs. Nos émeraudes vous permettront de naviguer avec prestige et puissance à travers les mers tumultueuses du jeu. Recevez 2600 Emerald à dépenser au marcher noir !',
        price: 25.0,
        games_id: 1,
        gameServers: [gameServer1.id, gameServer2.id],
        imagePath: path.join(assetsBasePath, 'emerald.webp'),
        discounts: [
          { currency: 'TRY', discount_percent: 50 },
          { currency: 'BRL', discount_percent: 35 },
        ],
        product_categories_id: 1,
      },
      {
        name: '5500 Emerald',
        description:
          'Découvrez les émeraudes magiques, la monnaie premium de SeaTyrants, utilisable pour améliorer vos navires, accéder à des équipements exclusifs. Nos émeraudes vous permettront de naviguer avec prestige et puissance à travers les mers tumultueuses du jeu. Recevez 5500 Emerald à dépenser au marcher noir !',
        price: 50.0,
        games_id: 1,
        gameServers: [gameServer1.id, gameServer2.id],
        imagePath: path.join(assetsBasePath, 'emerald.webp'),
        discounts: [
          { currency: 'TRY', discount_percent: 50 },
          { currency: 'BRL', discount_percent: 35 },
        ],
        product_categories_id: 1,
      },
      {
        name: 'World Of Warcraft',
        description: 'Le jeu',
        price: 50.0,
        games_id: 1,
        imagePath: path.join(assetsBasePath2, 'wow-picture.webp'),
        product_categories_id: 2,
      },
    ]

    for (const productData of products) {
      const imagePathInBucket: string = `products/images/${productData.name.replace(/\s+/g, '-').toLowerCase()}.webp`

      // Upload the image to S3 bucket
      await CloudStorageS3Service.uploadFileOrFolderInBucket({
        pathFilename: imagePathInBucket,
        bucketName: bucketNameBase,
        localPath: productData.imagePath,
      })

      // Create the file record in the database
      const imageFile: File = await CloudStorageS3Service.createFileInDB({
        pathFilename: imagePathInBucket,
        bucketName: bucketNameBase,
        localPath: productData.imagePath,
      })

      const product: Product = await Product.create({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        gamesId: productData.games_id,
        productCategoriesId: productData.product_categories_id,
        imageFilesId: imageFile.id,
      })

      // Associating game servers
      if (productData.gameServers) {
        await product.related('gameServers').attach(productData.gameServers)
      }

      // Adding discounts
      if (productData.discounts) {
        for (const discount of productData.discounts) {
          await ProductDiscount.create({
            productsId: product.id,
            currency: discount.currency,
            discountPercent: discount.discount_percent,
          })
        }
      }
    }
  }
}
