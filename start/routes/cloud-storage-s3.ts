import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import { UserRoles } from '#enums/user_roles'

router
  .get('/cloud-storage-s3/buckets', [controllers.CloudStorageS3, 'getAllBuckets'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .post('/cloud-storage-s3/list-files', [controllers.CloudStorageS3, 'getListFilesObjectInBucket'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .post('/cloud-storage-s3/upload', [controllers.CloudStorageS3, 'uploadFileOrFolderInBucket'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .get('/cloud-storage-s3/download', [controllers.CloudStorageS3, 'downloadFileOrFolderInBucket'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .get('/cloud-storage-s3/launcher/download', [controllers.CloudStorageS3, 'streamDownloadFileInBucketForLauncher'])
  .use(middleware.auth())
router
  .get('/cloud-storage-s3/launcher/presign', [controllers.CloudStorageS3, 'getPresignedDownloadUrlForLauncher'])
  .use(middleware.auth())
router
  .post('/cloud-storage-s3/delete', [controllers.CloudStorageS3, 'deleteInBucketAndDB'])
  .use(middleware.authRole([UserRoles.STAFF, UserRoles.ADMIN]))
router
  .post('/cloud-storage-s3/file-or-folder/size', [controllers.CloudStorageS3, 'getTotalSizeFileOrFolderInBucket'])
  .use(middleware.auth())
router.post('/cloud-storage-s3/content', [controllers.CloudStorageS3, 'getFileContentInBucket']).use(middleware.auth())
