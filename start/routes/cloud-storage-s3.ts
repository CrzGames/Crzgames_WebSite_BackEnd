import Route from '@ioc:Adonis/Core/Route'

Route.group((): void => {
  Route.get('/cloud-storage-s3/buckets', 'CloudStorageS3Controller.getAllBuckets')
  Route.post('/cloud-storage-s3/list-files', 'CloudStorageS3Controller.getListFilesObjectInBucket')
  Route.post('/cloud-storage-s3/upload', 'CloudStorageS3Controller.uploadFileOrFolderInBucket')
  Route.get('/cloud-storage-s3/download', 'CloudStorageS3Controller.downloadFileOrFolderInBucket')
  Route.get(
    '/cloud-storage-s3/launcher/download',
    'CloudStorageS3Controller.streamDownloadFileInBucketForLauncher',
  )
  Route.post('/cloud-storage-s3/delete', 'CloudStorageS3Controller.deleteInBucketAndDB')
  Route.post('/cloud-storage-s3/file-or-folder/size', 'CloudStorageS3Controller.getTotalSizeFileOrFolderInBucket')
  Route.post('/cloud-storage-s3/content', 'CloudStorageS3Controller.getFileContentInBucket')
})
