/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'health': {
    methods: ["GET","HEAD"]
    pattern: '/health'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/health_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/health_controller').default['handle']>>>
    }
  }
  'auth.sign_up': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/signup_validator').signUpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/signup_validator').signUpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signUp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signUp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.sign_in': {
    methods: ["POST"]
    pattern: '/signin'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/signin_validator').signInValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/signin_validator').signInValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signIn']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signIn']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.sign_out': {
    methods: ["POST"]
    pattern: '/signout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signOut']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signOut']>>>
    }
  }
  'auth.verify_code': {
    methods: ["POST"]
    pattern: '/verify'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/verify_code_validator').verifyCodeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/verify_code_validator').verifyCodeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyCode']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyCode']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.forgot_password': {
    methods: ["POST"]
    pattern: '/forgot-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/forgot_password_validator').forgotPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/forgot_password_validator').forgotPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['forgotPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['forgotPassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.reset_password': {
    methods: ["POST"]
    pattern: '/reset-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/reset_password_validator').resetPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/reset_password_validator').resetPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetPassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.send_mail_to_modify_email': {
    methods: ["POST"]
    pattern: '/modify-email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/send_mail_to_modify_email_validator').sendMailToModifyEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/send_mail_to_modify_email_validator').sendMailToModifyEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['sendMailToModifyEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['sendMailToModifyEmail']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.reset_email': {
    methods: ["POST"]
    pattern: '/reset-email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/reset_email_validator').resetEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/reset_email_validator').resetEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resetEmail']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.resend_new_code_verification_account': {
    methods: ["POST"]
    pattern: '/resend-code'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth/resend_new_code_verification_account_validator').resendNewCodeVerificationAccountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth/resend_new_code_verification_account_validator').resendNewCodeVerificationAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resendNewCodeVerificationAccount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['resendNewCodeVerificationAccount']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'carousel.get_all_carousels': {
    methods: ["GET","HEAD"]
    pattern: '/carousels'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['getAllCarousels']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['getAllCarousels']>>>
    }
  }
  'carousel.get_carousel_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/carousel/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['getCarouselById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['getCarouselById']>>>
    }
  }
  'carousel.create_carousel': {
    methods: ["POST"]
    pattern: '/carousel'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/carousel/create_carousel_validator').createCarouselValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/carousel/create_carousel_validator').createCarouselValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['createCarousel']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['createCarousel']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'carousel.update_carousel': {
    methods: ["PUT"]
    pattern: '/carousel/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/carousel/update_carousel_validator').updateCarouselValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/carousel/update_carousel_validator').updateCarouselValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['updateCarousel']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['updateCarousel']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'carousel.delete': {
    methods: ["DELETE"]
    pattern: '/carousel/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['delete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/carousel_controller').default['delete']>>>
    }
  }
  'cloud_storage_s_3.get_all_buckets': {
    methods: ["GET","HEAD"]
    pattern: '/cloud-storage-s3/buckets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getAllBuckets']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getAllBuckets']>>>
    }
  }
  'cloud_storage_s_3.get_list_files_object_in_bucket': {
    methods: ["POST"]
    pattern: '/cloud-storage-s3/list-files'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getListFilesObjectInBucket']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getListFilesObjectInBucket']>>>
    }
  }
  'cloud_storage_s_3.upload_file_or_folder_in_bucket': {
    methods: ["POST"]
    pattern: '/cloud-storage-s3/upload'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['uploadFileOrFolderInBucket']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['uploadFileOrFolderInBucket']>>>
    }
  }
  'cloud_storage_s_3.download_file_or_folder_in_bucket': {
    methods: ["GET","HEAD"]
    pattern: '/cloud-storage-s3/download'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['downloadFileOrFolderInBucket']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['downloadFileOrFolderInBucket']>>>
    }
  }
  'cloud_storage_s_3.stream_download_file_in_bucket_for_launcher': {
    methods: ["GET","HEAD"]
    pattern: '/cloud-storage-s3/launcher/download'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['streamDownloadFileInBucketForLauncher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['streamDownloadFileInBucketForLauncher']>>>
    }
  }
  'cloud_storage_s_3.get_presigned_download_url_for_launcher': {
    methods: ["GET","HEAD"]
    pattern: '/cloud-storage-s3/launcher/presign'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getPresignedDownloadUrlForLauncher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getPresignedDownloadUrlForLauncher']>>>
    }
  }
  'cloud_storage_s_3.delete_in_bucket_and_db': {
    methods: ["POST"]
    pattern: '/cloud-storage-s3/delete'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['deleteInBucketAndDB']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['deleteInBucketAndDB']>>>
    }
  }
  'cloud_storage_s_3.get_total_size_file_or_folder_in_bucket': {
    methods: ["POST"]
    pattern: '/cloud-storage-s3/file-or-folder/size'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getTotalSizeFileOrFolderInBucket']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getTotalSizeFileOrFolderInBucket']>>>
    }
  }
  'cloud_storage_s_3.get_file_content_in_bucket': {
    methods: ["POST"]
    pattern: '/cloud-storage-s3/content'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getFileContentInBucket']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cloud_storage_s3_controller').default['getFileContentInBucket']>>>
    }
  }
  'game_binary.get_game_binary_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/game-binary/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/game_binary/get_game_binaries_by_id_validator').getGameBinariesByIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_binary_controller').default['getGameBinaryById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_binary_controller').default['getGameBinaryById']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_binary.create_game_binary': {
    methods: ["POST"]
    pattern: '/game-binary'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/game_binary/create_game_binary_validator').createGameBinaryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/game_binary/create_game_binary_validator').createGameBinaryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_binary_controller').default['createGameBinary']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_binary_controller').default['createGameBinary']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_binary.update_game_binary': {
    methods: ["PUT"]
    pattern: '/game-binary/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/game_binary/update_game_binary_validator').updateGameBinaryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/game_binary/update_game_binary_validator').updateGameBinaryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_binary_controller').default['updateGameBinary']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_binary_controller').default['updateGameBinary']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_binary.delete_game_binary': {
    methods: ["DELETE"]
    pattern: '/game-binary/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/game_binary/delete_game_binaries_validator').deleteGameBinariesValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/game_binary/delete_game_binaries_validator').deleteGameBinariesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_binary_controller').default['deleteGameBinary']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_binary_controller').default['deleteGameBinary']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_binary_assignments.get_all_game_binary_assignment_by_game_id': {
    methods: ["GET","HEAD"]
    pattern: '/game/:gameId/binaries'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { gameId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/game_binary_assignment/get_all_game_binary_assignment_by_game_id_validator').getAllGameBinaryAssignmentByGameIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_binary_assignments_controller').default['getAllGameBinaryAssignmentByGameId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_binary_assignments_controller').default['getAllGameBinaryAssignmentByGameId']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_categories.get_all_game_categories': {
    methods: ["GET","HEAD"]
    pattern: '/game-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_categories_controller').default['getAllGameCategories']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_categories_controller').default['getAllGameCategories']>>>
    }
  }
  'game_category_assignments.get_all_game_category_assignment_by_game_id': {
    methods: ["GET","HEAD"]
    pattern: '/game/:gameId/categories'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { gameId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/game_category_assignment/get_all_game_category_assignment_by_game_id_validator').getAllGameCategoryAssignmentByGameIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_category_assignments_controller').default['getAllGameCategoryAssignmentByGameId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_category_assignments_controller').default['getAllGameCategoryAssignmentByGameId']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_category_assignments.get_all_game_category_assignment_by_category_id': {
    methods: ["GET","HEAD"]
    pattern: '/game/categories/:categoryId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { categoryId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/game_category_assignment/get_all_game_category_assignment_by_category_id_validator').getAllGameCategoryAssignmentByCategoryIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_category_assignments_controller').default['getAllGameCategoryAssignmentByCategoryId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_category_assignments_controller').default['getAllGameCategoryAssignmentByCategoryId']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_change_logs.create_game_change_log': {
    methods: ["POST"]
    pattern: '/game-change-log'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/GameChangeLog/CreateGameChangeLogValidator').createGameChangeLogValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/GameChangeLog/CreateGameChangeLogValidator').createGameChangeLogValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['createGameChangeLog']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['createGameChangeLog']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_change_logs.update_game_change_log': {
    methods: ["PUT"]
    pattern: '/game-change-log/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/GameChangeLog/UpdateGameChangeLogValidator').updateGameChangeLogValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/GameChangeLog/UpdateGameChangeLogValidator').updateGameChangeLogValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['updateGameChangeLog']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['updateGameChangeLog']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_change_logs.delete_game_change_log': {
    methods: ["DELETE"]
    pattern: '/game-change-log/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/GameChangeLog/DeleteGameChangeLogValidator').deleteGameChangeLogValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/GameChangeLog/DeleteGameChangeLogValidator').deleteGameChangeLogValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['deleteGameChangeLog']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['deleteGameChangeLog']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_change_logs.get_all_game_change_logs': {
    methods: ["GET","HEAD"]
    pattern: '/game-change-logs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['getAllGameChangeLogs']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['getAllGameChangeLogs']>>>
    }
  }
  'game_change_logs.get_all_game_change_log_by_game_id': {
    methods: ["GET","HEAD"]
    pattern: '/game-change-logs/game/:gameId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { gameId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/GameChangeLog/GetAllGameChangeLogByGameIdValidator').getAllGameChangeLogByGameIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['getAllGameChangeLogByGameId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['getAllGameChangeLogByGameId']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_change_logs.get_game_change_log_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/game-change-log/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/GameChangeLog/GetGameChangeLogByIdValidator').getGameChangeLogByIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['getGameChangeLogById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['getGameChangeLogById']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_change_logs.get_all_game_change_log_by_game_title': {
    methods: ["GET","HEAD"]
    pattern: '/game-change-logs/game-title/:title'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { title: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/GameChangeLog/GetAllGameChangeLogByTitleValidator').getAllGameChangeLogByTitleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['getAllGameChangeLogByGameTitle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_change_logs_controller').default['getAllGameChangeLogByGameTitle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_platform_assignments.get_all_game_platform_assignment_by_game_id': {
    methods: ["GET","HEAD"]
    pattern: '/game/:gameId/platforms'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { gameId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/GamePlatformAssignment/GetAllGamePlatformAssignmentByGameIdValidator').getAllGamePlatformAssignmentByGameIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_platform_assignments_controller').default['getAllGamePlatformAssignmentByGameId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_platform_assignments_controller').default['getAllGamePlatformAssignmentByGameId']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_platform_assignments.get_all_game_platform_assignment_by_platform_id': {
    methods: ["GET","HEAD"]
    pattern: '/game/platforms/:platformId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { platformId: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/GamePlatformAssignment/GetAllGamePlatformAssignmentByPlatformIdValidator').getAllGamePlatformAssignmentByPlatformIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_platform_assignments_controller').default['getAllGamePlatformAssignmentByPlatformId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_platform_assignments_controller').default['getAllGamePlatformAssignmentByPlatformId']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_platforms.get_all_game_platforms': {
    methods: ["GET","HEAD"]
    pattern: '/game-platforms'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_platforms_controller').default['getAllGamePlatforms']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_platforms_controller').default['getAllGamePlatforms']>>>
    }
  }
  'games.create_games': {
    methods: ["POST"]
    pattern: '/game'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/game/create_game_validator').createGameValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/game/create_game_validator').createGameValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/games_controller').default['createGames']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/games_controller').default['createGames']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'games.get_games_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/game/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/games_controller').default['getGamesById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/games_controller').default['getGamesById']>>>
    }
  }
  'games.get_all_games_by_title': {
    methods: ["GET","HEAD"]
    pattern: '/games/title/:title'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { title: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/games_controller').default['getAllGamesByTitle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/games_controller').default['getAllGamesByTitle']>>>
    }
  }
  'games.get_game_by_title': {
    methods: ["GET","HEAD"]
    pattern: '/game'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/games_controller').default['getGameByTitle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/games_controller').default['getGameByTitle']>>>
    }
  }
  'games.get_all_games': {
    methods: ["GET","HEAD"]
    pattern: '/games'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/games_controller').default['getAllGames']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/games_controller').default['getAllGames']>>>
    }
  }
  'games.update_games': {
    methods: ["PUT"]
    pattern: '/game/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/game/update_game_validator').updateGameValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/game/update_game_validator').updateGameValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/games_controller').default['updateGames']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/games_controller').default['updateGames']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'games.delete_games': {
    methods: ["DELETE"]
    pattern: '/game/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/games_controller').default['deleteGames']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/games_controller').default['deleteGames']>>>
    }
  }
  'game_server.get_all_game_servers': {
    methods: ["GET","HEAD"]
    pattern: '/game-servers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_server_controller').default['getAllGameServers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_server_controller').default['getAllGameServers']>>>
    }
  }
  'game_server.create_game_server': {
    methods: ["POST"]
    pattern: '/game-servers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_server_controller').default['createGameServer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_server_controller').default['createGameServer']>>>
    }
  }
  'game_versions.create_game_version': {
    methods: ["POST"]
    pattern: '/games/:gameId/versions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/game_versions/create_game_version_validator').createGameVersionValidator)>>
      paramsTuple: [ParamValue]
      params: { gameId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/game_versions/create_game_version_validator').createGameVersionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['createGameVersion']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['createGameVersion']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_versions.get_all_game_versions_by_game_id': {
    methods: ["GET","HEAD"]
    pattern: '/games/:gameId/versions'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { gameId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['getAllGameVersionsByGameId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['getAllGameVersionsByGameId']>>>
    }
  }
  'game_versions.get_all_game_versions': {
    methods: ["GET","HEAD"]
    pattern: '/games/versions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['getAllGameVersions']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['getAllGameVersions']>>>
    }
  }
  'game_versions.get_game_version': {
    methods: ["GET","HEAD"]
    pattern: '/games/:gameId/versions/:gameVersionId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { gameId: ParamValue; gameVersionId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['getGameVersion']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['getGameVersion']>>>
    }
  }
  'game_versions.update_game_version': {
    methods: ["PUT"]
    pattern: '/games/:gameId/versions/:gameVersionId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/game_versions/update_game_version_validator').updateGameVersionValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { gameId: ParamValue; gameVersionId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/game_versions/update_game_version_validator').updateGameVersionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['updateGameVersion']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['updateGameVersion']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'game_versions.delete_game_version': {
    methods: ["DELETE"]
    pattern: '/games/:gameId/versions/:gameVersionId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { gameId: ParamValue; gameVersionId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['deleteGameVersion']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['deleteGameVersion']>>>
    }
  }
  'game_versions.get_latest_available_version': {
    methods: ["GET","HEAD"]
    pattern: '/games/:gameId/version-latest'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { gameId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['getLatestAvailableVersion']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/game_versions_controller').default['getLatestAvailableVersion']>>>
    }
  }
  'languages.get_all_languages': {
    methods: ["GET","HEAD"]
    pattern: '/languages'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/languages_controller').default['getAllLanguages']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/languages_controller').default['getAllLanguages']>>>
    }
  }
  'launcher_crz.check_is_available_version_launcher': {
    methods: ["GET","HEAD"]
    pattern: '/launcher/updater-manifest/:os/:archSystem/:currentVersion'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { os: ParamValue; archSystem: ParamValue; currentVersion: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/launcher_crz_controller').default['checkIsAvailableVersionLauncher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/launcher_crz_controller').default['checkIsAvailableVersionLauncher']>>>
    }
  }
  'launcher_crz.download_launcher': {
    methods: ["GET","HEAD"]
    pattern: '/launcher/download/:nameBundle'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { nameBundle: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/launcher_crz_controller').default['downloadLauncher']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/launcher_crz_controller').default['downloadLauncher']>>>
    }
  }
  'maintenance_web_site.update_is_maintenance': {
    methods: ["PUT"]
    pattern: '/maintenance-websites/is-maintenance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maintenance_web_site_controller').default['updateIsMaintenance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maintenance_web_site_controller').default['updateIsMaintenance']>>>
    }
  }
  'maintenance_web_site.is_maintenance': {
    methods: ["GET","HEAD"]
    pattern: '/maintenance-websites/is-maintenance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/maintenance_web_site_controller').default['isMaintenance']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/maintenance_web_site_controller').default['isMaintenance']>>>
    }
  }
  'nats.publish': {
    methods: ["POST"]
    pattern: '/publish'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/nats_controller').default['publish']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/nats_controller').default['publish']>>>
    }
  }
  'nats.subscribe': {
    methods: ["POST"]
    pattern: '/subscribe'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/nats_controller').default['subscribe']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/nats_controller').default['subscribe']>>>
    }
  }
  'order_product.create_order_product': {
    methods: ["POST"]
    pattern: '/order-products'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_product_controller').default['createOrderProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_product_controller').default['createOrderProduct']>>>
    }
  }
  'order_product.update_order_product': {
    methods: ["PUT"]
    pattern: '/order-products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_product_controller').default['updateOrderProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_product_controller').default['updateOrderProduct']>>>
    }
  }
  'order_product.delete_order_product': {
    methods: ["DELETE"]
    pattern: '/order-products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_product_controller').default['deleteOrderProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_product_controller').default['deleteOrderProduct']>>>
    }
  }
  'order_product.get_all_order_products_by_order_id': {
    methods: ["GET","HEAD"]
    pattern: '/order-products/order/:orders_id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { orders_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_product_controller').default['getAllOrderProductsByOrderId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_product_controller').default['getAllOrderProductsByOrderId']>>>
    }
  }
  'order.create_order': {
    methods: ["POST"]
    pattern: '/orders'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/Order/CreateOrderValidator').createOrderValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/Order/CreateOrderValidator').createOrderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_controller').default['createOrder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_controller').default['createOrder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'order.update_order': {
    methods: ["PUT"]
    pattern: '/orders/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/Order/UpdateOrderValidator').updateOrderValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/Order/UpdateOrderValidator').updateOrderValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_controller').default['updateOrder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_controller').default['updateOrder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'order.delete_order': {
    methods: ["DELETE"]
    pattern: '/orders/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_controller').default['deleteOrder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_controller').default['deleteOrder']>>>
    }
  }
  'order.get_all_orders_by_user_id': {
    methods: ["GET","HEAD"]
    pattern: '/orders/user/:users_id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { users_id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_controller').default['getAllOrdersByUserId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_controller').default['getAllOrdersByUserId']>>>
    }
  }
  'order.get_order_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/orders/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/order_controller').default['getOrderById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/order_controller').default['getOrderById']>>>
    }
  }
  'product_category.get_all_product_categories': {
    methods: ["GET","HEAD"]
    pattern: '/product-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_category_controller').default['getAllProductCategories']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_category_controller').default['getAllProductCategories']>>>
    }
  }
  'product_discount.create_product_discount': {
    methods: ["POST"]
    pattern: '/product-discounts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product_discount/create_product_discount_validator').createProductDiscountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/product_discount/create_product_discount_validator').createProductDiscountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['createProductDiscount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['createProductDiscount']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'product_discount.get_product_discount_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/product-discounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['getProductDiscountById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['getProductDiscountById']>>>
    }
  }
  'product_discount.get_all_product_discounts_by_product_id': {
    methods: ["GET","HEAD"]
    pattern: '/product-discounts/product/:productId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { productId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['getAllProductDiscountsByProductId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['getAllProductDiscountsByProductId']>>>
    }
  }
  'product_discount.update_product_discount': {
    methods: ["PUT"]
    pattern: '/product-discounts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product_discount/update_product_discount_validator').updateProductDiscountValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/product_discount/update_product_discount_validator').updateProductDiscountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['updateProductDiscount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['updateProductDiscount']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'product_discount.delete_product_discount': {
    methods: ["DELETE"]
    pattern: '/product-discounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['deleteProductDiscount']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_discount_controller').default['deleteProductDiscount']>>>
    }
  }
  'product_game_server.get_all_product_game_servers': {
    methods: ["GET","HEAD"]
    pattern: '/product-game-servers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_game_server_controller').default['getAllProductGameServers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_game_server_controller').default['getAllProductGameServers']>>>
    }
  }
  'product_game_server.create_product_game_server': {
    methods: ["POST"]
    pattern: '/product-game-servers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_game_server_controller').default['createProductGameServer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_game_server_controller').default['createProductGameServer']>>>
    }
  }
  'product.create_product': {
    methods: ["POST"]
    pattern: '/products'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/Product/CreateProductValidator').createProductValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/Product/CreateProductValidator').createProductValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_controller').default['createProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_controller').default['createProduct']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'product.get_product_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getProductById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getProductById']>>>
    }
  }
  'product.get_all_products': {
    methods: ["GET","HEAD"]
    pattern: '/products'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getAllProducts']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getAllProducts']>>>
    }
  }
  'product.get_product_by_name': {
    methods: ["GET","HEAD"]
    pattern: '/products/name/:name'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { name: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getProductByName']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getProductByName']>>>
    }
  }
  'product.update_product': {
    methods: ["PUT"]
    pattern: '/products/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/Product/UpdateProductValidator').updateProductValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/Product/UpdateProductValidator').updateProductValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_controller').default['updateProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_controller').default['updateProduct']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'product.delete_product': {
    methods: ["DELETE"]
    pattern: '/products/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_controller').default['deleteProduct']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_controller').default['deleteProduct']>>>
    }
  }
  'product.get_game_product_paid_and_owned': {
    methods: ["GET","HEAD"]
    pattern: '/products/games/:gameId/paid-and-owned'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { gameId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getGameProductPaidAndOwned']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getGameProductPaidAndOwned']>>>
    }
  }
  'product.get_all_games_products_paid_and_owned': {
    methods: ["GET","HEAD"]
    pattern: '/products/games/paid-and-owned'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getAllGamesProductsPaidAndOwned']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/product_controller').default['getAllGamesProductsPaidAndOwned']>>>
    }
  }
  'seatyrants.get_info_user': {
    methods: ["GET","HEAD"]
    pattern: '/seatyrants/info-user'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/SeaTyrants/GetInfoUserValidator').getInfoUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/seatyrants_controller').default['getInfoUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/seatyrants_controller').default['getInfoUser']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'stripe.create_payment_intent_stripe': {
    methods: ["POST"]
    pattern: '/stripe/create-payment-intent'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stripe_controller').default['createPaymentIntentStripe']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/stripe_controller').default['createPaymentIntentStripe']>>>
    }
  }
  'stripe.check_proxy_vpn': {
    methods: ["POST"]
    pattern: '/proxy-check-io'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/Stripe/check_proxy_vpn_validator').checkProxyVpnValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/Stripe/check_proxy_vpn_validator').checkProxyVpnValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stripe_controller').default['checkProxyVPN']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/stripe_controller').default['checkProxyVPN']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'stripe.handle_webhook_stripe': {
    methods: ["POST"]
    pattern: '/stripe/webhooks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/stripe_controller').default['handleWebhookStripe']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/stripe_controller').default['handleWebhookStripe']>>>
    }
  }
  'ticket_categories.get_all_ticket_categories': {
    methods: ["GET","HEAD"]
    pattern: '/ticket-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ticket_categories_controller').default['getAllTicketCategories']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ticket_categories_controller').default['getAllTicketCategories']>>>
    }
  }
  'ticket_responses.create_ticket_responses': {
    methods: ["POST"]
    pattern: '/ticket-response'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/TicketResponse/CreateTicketResponsesValidator').createTicketResponsesValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/TicketResponse/CreateTicketResponsesValidator').createTicketResponsesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ticket_responses_controller').default['createTicketResponses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ticket_responses_controller').default['createTicketResponses']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'ticket_responses.get_all_tickets_responses_by_ticket_id': {
    methods: ["GET","HEAD"]
    pattern: '/ticket-response/:ticketId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { ticketId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ticket_responses_controller').default['getAllTicketsResponsesByTicketId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ticket_responses_controller').default['getAllTicketsResponsesByTicketId']>>>
    }
  }
  'tickets.create_tickets': {
    methods: ["POST"]
    pattern: '/ticket'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/Ticket/CreateTicketsValidator').createTicketsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/Ticket/CreateTicketsValidator').createTicketsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['createTickets']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['createTickets']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'tickets.get_tickets_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/ticket/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['getTicketsById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['getTicketsById']>>>
    }
  }
  'tickets.get_all_tickets': {
    methods: ["GET","HEAD"]
    pattern: '/tickets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['getAllTickets']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['getAllTickets']>>>
    }
  }
  'tickets.get_all_tickets_by_user_id': {
    methods: ["GET","HEAD"]
    pattern: '/tickets/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['getAllTicketsByUserId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['getAllTicketsByUserId']>>>
    }
  }
  'tickets.update_ticket_by_id_for_status': {
    methods: ["PUT"]
    pattern: '/tickets/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/Ticket/update_ticket_by_id_for_status_validator').updateTicketByIdForStatusValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/Ticket/update_ticket_by_id_for_status_validator').updateTicketByIdForStatusValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['updateTicketByIdForStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['updateTicketByIdForStatus']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'tickets.get_tickets_count_by_status_open_for_user': {
    methods: ["GET","HEAD"]
    pattern: '/tickets-open-count/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['getTicketsCountByStatusOpenForUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/tickets_controller').default['getTicketsCountByStatusOpenForUser']>>>
    }
  }
  'ticket_statuses.get_all_ticket_statuses': {
    methods: ["GET","HEAD"]
    pattern: '/ticket-statuses'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ticket_statuses_controller').default['getAllTicketStatuses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ticket_statuses_controller').default['getAllTicketStatuses']>>>
    }
  }
  'user_game_libraries.get_all_users_games_libraries_by_user_id': {
    methods: ["GET","HEAD"]
    pattern: '/user-game-libraries/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user_game_libraries_controller').default['getAllUsersGamesLibrariesByUserId']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user_game_libraries_controller').default['getAllUsersGamesLibrariesByUserId']>>>
    }
  }
  'user_game_libraries.add_game_to_user_game_libraries': {
    methods: ["POST"]
    pattern: '/user-game-libraries'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/UserGameLibrary/CreateUsersGamesLibrariesValidator').createUsersGamesLibrariesValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/UserGameLibrary/CreateUsersGamesLibrariesValidator').createUsersGamesLibrariesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user_game_libraries_controller').default['addGameToUserGameLibraries']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user_game_libraries_controller').default['addGameToUserGameLibraries']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'user_roles.get_all_user_roles': {
    methods: ["GET","HEAD"]
    pattern: '/user-roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user_roles_controller').default['getAllUserRoles']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user_roles_controller').default['getAllUserRoles']>>>
    }
  }
  'users.decode_token_return_user': {
    methods: ["GET","HEAD"]
    pattern: '/user'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['decodeTokenReturnUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['decodeTokenReturnUser']>>>
    }
  }
  'users.get_vars_environment_for_user': {
    methods: ["GET","HEAD"]
    pattern: '/user/sensitive-data'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['getVarsEnvironmentForUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['getVarsEnvironmentForUser']>>>
    }
  }
  'users.get_users_by_id': {
    methods: ["GET","HEAD"]
    pattern: '/user/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/User/GetUsersByIdValidator').getUsersByIdValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['getUsersById']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['getUsersById']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.get_all_users': {
    methods: ["GET","HEAD"]
    pattern: '/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['getAllUsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['getAllUsers']>>>
    }
  }
  'users.get_all_users_by_username_or_email': {
    methods: ["GET","HEAD"]
    pattern: '/users/by-username-or-email/:usernameOrEmail'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { usernameOrEmail: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['getAllUsersByUsernameOrEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['getAllUsersByUsernameOrEmail']>>>
    }
  }
  'users.update_users': {
    methods: ["PUT"]
    pattern: '/user/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/User/UpdateUsersValidator').updateUsersValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/User/UpdateUsersValidator').updateUsersValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['updateUsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['updateUsers']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.delete_users': {
    methods: ["DELETE"]
    pattern: '/user/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/User/DeleteUsersValidator').deleteUsersValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/User/DeleteUsersValidator').deleteUsersValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['deleteUsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['deleteUsers']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.update_users_role': {
    methods: ["PUT"]
    pattern: '/user/:userId/role/:roleId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/User/UpdateUsersRoleValidator').updateUsersRoleValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { userId: ParamValue; roleId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/User/UpdateUsersRoleValidator').updateUsersRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['updateUsersRole']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['updateUsersRole']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
