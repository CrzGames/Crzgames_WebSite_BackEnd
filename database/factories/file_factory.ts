import factory from '@adonisjs/lucid/factories'
import File from '#models/file'

export const FileFactory = factory
  .define(File, ({ faker }) => {
    return {
      pathfilename: faker.system.filePath(),
      url: faker.internet.url(),
      buckets_id: 1,
    }
  })
  .build()
