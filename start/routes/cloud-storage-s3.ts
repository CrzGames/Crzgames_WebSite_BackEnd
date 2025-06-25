import router from '@adonisjs/core/services/router'
const CloudStorageS3Controller = () => import('#controllers/cloud_storage_s3_controller')

router.group((): void => {
  router.get('/cloud-storage-s3/buckets', [CloudStorageS3Controller, 'getAllBuckets'])
  router.post('/cloud-storage-s3/list-files', [CloudStorageS3Controller, 'getListFilesObjectInBucket'])
  router.post('/cloud-storage-s3/upload', [CloudStorageS3Controller, 'uploadFileOrFolderInBucket'])
  router.get('/cloud-storage-s3/download', [CloudStorageS3Controller, 'downloadFileOrFolderInBucket'])
  router.get('/cloud-storage-s3/launcher/download', [CloudStorageS3Controller, 'streamDownloadFileInBucketForLauncher'])
  router.post('/cloud-storage-s3/delete', [CloudStorageS3Controller, 'deleteInBucketAndDB'])
  router.post('/cloud-storage-s3/file-or-folder/size', [CloudStorageS3Controller, 'getTotalSizeFileOrFolderInBucket'])
  router.post('/cloud-storage-s3/content', [CloudStorageS3Controller, 'getFileContentInBucket'])
})
