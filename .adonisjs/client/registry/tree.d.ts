/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  health: typeof routes['health']
  auth: {
    signUp: typeof routes['auth.sign_up']
    signIn: typeof routes['auth.sign_in']
    signOut: typeof routes['auth.sign_out']
    verifyCode: typeof routes['auth.verify_code']
    forgotPassword: typeof routes['auth.forgot_password']
    resetPassword: typeof routes['auth.reset_password']
    sendMailToModifyEmail: typeof routes['auth.send_mail_to_modify_email']
    resetEmail: typeof routes['auth.reset_email']
    resendNewCodeVerificationAccount: typeof routes['auth.resend_new_code_verification_account']
  }
  carousel: {
    getAllCarousels: typeof routes['carousel.get_all_carousels']
    getCarouselById: typeof routes['carousel.get_carousel_by_id']
    createCarousel: typeof routes['carousel.create_carousel']
    updateCarousel: typeof routes['carousel.update_carousel']
    delete: typeof routes['carousel.delete']
  }
  cloudStorageS3: {
    getAllBuckets: typeof routes['cloud_storage_s_3.get_all_buckets']
    getListFilesObjectInBucket: typeof routes['cloud_storage_s_3.get_list_files_object_in_bucket']
    uploadFileOrFolderInBucket: typeof routes['cloud_storage_s_3.upload_file_or_folder_in_bucket']
    downloadFileOrFolderInBucket: typeof routes['cloud_storage_s_3.download_file_or_folder_in_bucket']
    streamDownloadFileInBucketForLauncher: typeof routes['cloud_storage_s_3.stream_download_file_in_bucket_for_launcher']
    getPresignedDownloadUrlForLauncher: typeof routes['cloud_storage_s_3.get_presigned_download_url_for_launcher']
    getPresignedDownloadUrlsForLauncher: typeof routes['cloud_storage_s_3.get_presigned_download_urls_for_launcher']
    deleteInBucketAndDb: typeof routes['cloud_storage_s_3.delete_in_bucket_and_db']
    getTotalSizeFileOrFolderInBucket: typeof routes['cloud_storage_s_3.get_total_size_file_or_folder_in_bucket']
    getFileContentInBucket: typeof routes['cloud_storage_s_3.get_file_content_in_bucket']
  }
  gameBinary: {
    getGameBinaryById: typeof routes['game_binary.get_game_binary_by_id']
    createGameBinary: typeof routes['game_binary.create_game_binary']
    updateGameBinary: typeof routes['game_binary.update_game_binary']
    deleteGameBinary: typeof routes['game_binary.delete_game_binary']
  }
  gameBinaryAssignments: {
    getAllGameBinaryAssignmentByGameId: typeof routes['game_binary_assignments.get_all_game_binary_assignment_by_game_id']
  }
  gameCategories: {
    getAllGameCategories: typeof routes['game_categories.get_all_game_categories']
  }
  gameCategoryAssignments: {
    getAllGameCategoryAssignmentByGameId: typeof routes['game_category_assignments.get_all_game_category_assignment_by_game_id']
    getAllGameCategoryAssignmentByCategoryId: typeof routes['game_category_assignments.get_all_game_category_assignment_by_category_id']
  }
  gameChangeLogs: {
    createGameChangeLog: typeof routes['game_change_logs.create_game_change_log']
    updateGameChangeLog: typeof routes['game_change_logs.update_game_change_log']
    deleteGameChangeLog: typeof routes['game_change_logs.delete_game_change_log']
    getAllGameChangeLogs: typeof routes['game_change_logs.get_all_game_change_logs']
    getAllGameChangeLogByGameId: typeof routes['game_change_logs.get_all_game_change_log_by_game_id']
    getGameChangeLogById: typeof routes['game_change_logs.get_game_change_log_by_id']
    getAllGameChangeLogByGameTitle: typeof routes['game_change_logs.get_all_game_change_log_by_game_title']
  }
  gamePlatformAssignments: {
    getAllGamePlatformAssignmentByGameId: typeof routes['game_platform_assignments.get_all_game_platform_assignment_by_game_id']
    getAllGamePlatformAssignmentByPlatformId: typeof routes['game_platform_assignments.get_all_game_platform_assignment_by_platform_id']
  }
  gamePlatforms: {
    getAllGamePlatforms: typeof routes['game_platforms.get_all_game_platforms']
  }
  games: {
    createGames: typeof routes['games.create_games']
    getGamesById: typeof routes['games.get_games_by_id']
    getAllGamesByTitle: typeof routes['games.get_all_games_by_title']
    getGameByTitle: typeof routes['games.get_game_by_title']
    getAllGames: typeof routes['games.get_all_games']
    updateGames: typeof routes['games.update_games']
    deleteGames: typeof routes['games.delete_games']
  }
  gameServer: {
    getAllGameServers: typeof routes['game_server.get_all_game_servers']
    createGameServer: typeof routes['game_server.create_game_server']
  }
  gameVersions: {
    createGameVersion: typeof routes['game_versions.create_game_version']
    getAllGameVersionsByGameId: typeof routes['game_versions.get_all_game_versions_by_game_id']
    getAllGameVersions: typeof routes['game_versions.get_all_game_versions']
    getGameVersion: typeof routes['game_versions.get_game_version']
    updateGameVersion: typeof routes['game_versions.update_game_version']
    deleteGameVersion: typeof routes['game_versions.delete_game_version']
    getLatestAvailableVersion: typeof routes['game_versions.get_latest_available_version']
  }
  languages: {
    getAllLanguages: typeof routes['languages.get_all_languages']
  }
  launcherCrz: {
    checkIsAvailableVersionLauncher: typeof routes['launcher_crz.check_is_available_version_launcher']
    downloadLauncher: typeof routes['launcher_crz.download_launcher']
  }
  maintenanceWebSite: {
    updateIsMaintenance: typeof routes['maintenance_web_site.update_is_maintenance']
    isMaintenance: typeof routes['maintenance_web_site.is_maintenance']
  }
  nats: {
    publish: typeof routes['nats.publish']
    subscribe: typeof routes['nats.subscribe']
  }
  orderProduct: {
    createOrderProduct: typeof routes['order_product.create_order_product']
    updateOrderProduct: typeof routes['order_product.update_order_product']
    deleteOrderProduct: typeof routes['order_product.delete_order_product']
    getAllOrderProductsByOrderId: typeof routes['order_product.get_all_order_products_by_order_id']
  }
  order: {
    createOrder: typeof routes['order.create_order']
    updateOrder: typeof routes['order.update_order']
    deleteOrder: typeof routes['order.delete_order']
    getAllOrdersByUserId: typeof routes['order.get_all_orders_by_user_id']
    getOrderById: typeof routes['order.get_order_by_id']
  }
  productCategory: {
    getAllProductCategories: typeof routes['product_category.get_all_product_categories']
  }
  productDiscount: {
    createProductDiscount: typeof routes['product_discount.create_product_discount']
    getProductDiscountById: typeof routes['product_discount.get_product_discount_by_id']
    getAllProductDiscountsByProductId: typeof routes['product_discount.get_all_product_discounts_by_product_id']
    updateProductDiscount: typeof routes['product_discount.update_product_discount']
    deleteProductDiscount: typeof routes['product_discount.delete_product_discount']
  }
  productGameServer: {
    getAllProductGameServers: typeof routes['product_game_server.get_all_product_game_servers']
    createProductGameServer: typeof routes['product_game_server.create_product_game_server']
  }
  product: {
    createProduct: typeof routes['product.create_product']
    getProductById: typeof routes['product.get_product_by_id']
    getAllProducts: typeof routes['product.get_all_products']
    getProductByName: typeof routes['product.get_product_by_name']
    updateProduct: typeof routes['product.update_product']
    deleteProduct: typeof routes['product.delete_product']
    getGameProductPaidAndOwned: typeof routes['product.get_game_product_paid_and_owned']
    getAllGamesProductsPaidAndOwned: typeof routes['product.get_all_games_products_paid_and_owned']
  }
  seatyrants: {
    getInfoUser: typeof routes['seatyrants.get_info_user']
  }
  stripe: {
    createPaymentIntentStripe: typeof routes['stripe.create_payment_intent_stripe']
    checkProxyVpn: typeof routes['stripe.check_proxy_vpn']
    handleWebhookStripe: typeof routes['stripe.handle_webhook_stripe']
  }
  ticketCategories: {
    getAllTicketCategories: typeof routes['ticket_categories.get_all_ticket_categories']
  }
  ticketResponses: {
    createTicketResponses: typeof routes['ticket_responses.create_ticket_responses']
    getAllTicketsResponsesByTicketId: typeof routes['ticket_responses.get_all_tickets_responses_by_ticket_id']
  }
  tickets: {
    createTickets: typeof routes['tickets.create_tickets']
    getTicketsById: typeof routes['tickets.get_tickets_by_id']
    getAllTickets: typeof routes['tickets.get_all_tickets']
    getAllTicketsByUserId: typeof routes['tickets.get_all_tickets_by_user_id']
    updateTicketByIdForStatus: typeof routes['tickets.update_ticket_by_id_for_status']
    getTicketsCountByStatusOpenForUser: typeof routes['tickets.get_tickets_count_by_status_open_for_user']
  }
  ticketStatuses: {
    getAllTicketStatuses: typeof routes['ticket_statuses.get_all_ticket_statuses']
  }
  userGameLibraries: {
    getAllUsersGamesLibrariesByUserId: typeof routes['user_game_libraries.get_all_users_games_libraries_by_user_id']
    addGameToUserGameLibraries: typeof routes['user_game_libraries.add_game_to_user_game_libraries']
  }
  userRoles: {
    getAllUserRoles: typeof routes['user_roles.get_all_user_roles']
  }
  users: {
    decodeTokenReturnUser: typeof routes['users.decode_token_return_user']
    getVarsEnvironmentForUser: typeof routes['users.get_vars_environment_for_user']
    getUsersById: typeof routes['users.get_users_by_id']
    getAllUsers: typeof routes['users.get_all_users']
    getAllUsersByUsernameOrEmail: typeof routes['users.get_all_users_by_username_or_email']
    updateUsers: typeof routes['users.update_users']
    deleteUsers: typeof routes['users.delete_users']
    updateUsersRole: typeof routes['users.update_users_role']
  }
  eventStream: typeof routes['event_stream']
  subscribe: typeof routes['subscribe']
  unsubscribe: typeof routes['unsubscribe']
}
