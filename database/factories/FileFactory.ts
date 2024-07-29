import Factory from '@ioc:Adonis/Lucid/Factory'
import File from 'App/Models/File'

export const FileFactory = Factory.define(File, ({ faker }) => {
  return {
    pathfilename: faker.system.filePath(),
    url: faker.internet.url(),
    buckets_id: 1,
  }
}).build()
