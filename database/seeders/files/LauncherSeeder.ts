import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import path from 'path'
import fs from 'fs/promises'
import CloudStorageS3Service from 'App/Services/CloudStorageS3Service'
import Logger from '@ioc:Adonis/Core/Logger'

export default class extends BaseSeeder {
  public static environment: string[] = ['development', 'test']

  public async run(): Promise<void> {
    const assetsBasePath: string = path.resolve('database/seeders/assets-bucket-s3/LauncherSeeder/')
    const bucketNameBase: string = 'crzgames-public'

    Logger.info('Starting LauncherSeeder')

    // Fonction pour téléverser récursivement les fichiers
    const uploadDirContents = async (localPath: string): Promise<void> => {
      const entries = await fs.readdir(localPath, { withFileTypes: true })
      for (let entry of entries) {
        const entryPath: string = path.join(localPath, entry.name)
        if (entry.isDirectory()) {
          await uploadDirContents(entryPath) // Récursion pour les dossiers
        } else {
          const pathInBucket: string = entryPath.replace(assetsBasePath, '').slice(1) // Supprime le chemin de base et le slash initial
          await CloudStorageS3Service.uploadFileOrFolderInBucket({
            pathFilename: pathInBucket,
            bucketName: bucketNameBase,
            localPath: entryPath,
          })
        }
      }
    }

    // Démarre le téléversement pour le dossier spécifié
    await uploadDirContents(assetsBasePath)

    Logger.info('LauncherSeeder Finished.')
  }
}
