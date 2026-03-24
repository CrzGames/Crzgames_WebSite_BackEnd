import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/cloud-storage-s3/buckets', [controllers.CloudStorageS3, 'getAllBuckets'])
router.post('/cloud-storage-s3/list-files', [controllers.CloudStorageS3, 'getListFilesObjectInBucket'])
router.post('/cloud-storage-s3/upload', [controllers.CloudStorageS3, 'uploadFileOrFolderInBucket'])
router.get('/cloud-storage-s3/download', [controllers.CloudStorageS3, 'downloadFileOrFolderInBucket'])
router.get('/cloud-storage-s3/launcher/download', [controllers.CloudStorageS3, 'streamDownloadFileInBucketForLauncher'])
router.post('/cloud-storage-s3/delete', [controllers.CloudStorageS3, 'deleteInBucketAndDB'])
router.post('/cloud-storage-s3/file-or-folder/size', [controllers.CloudStorageS3, 'getTotalSizeFileOrFolderInBucket'])
router.post('/cloud-storage-s3/content', [controllers.CloudStorageS3, 'getFileContentInBucket'])
