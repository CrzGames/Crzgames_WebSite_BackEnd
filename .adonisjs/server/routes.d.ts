import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'health': { paramsTuple?: []; params?: {} }
    'auth.sign_up': { paramsTuple?: []; params?: {} }
    'auth.sign_in': { paramsTuple?: []; params?: {} }
    'auth.sign_out': { paramsTuple?: []; params?: {} }
    'auth.verify_code': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.send_mail_to_modify_email': { paramsTuple?: []; params?: {} }
    'auth.reset_email': { paramsTuple?: []; params?: {} }
    'auth.resend_new_code_verification_account': { paramsTuple?: []; params?: {} }
    'carousel.get_all_carousels': { paramsTuple?: []; params?: {} }
    'carousel.get_carousel_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'carousel.create_carousel': { paramsTuple?: []; params?: {} }
    'carousel.update_carousel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'carousel.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cloud_storage_s_3.get_all_buckets': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_list_files_object_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.upload_file_or_folder_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.download_file_or_folder_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.stream_download_file_in_bucket_for_launcher': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_presigned_download_url_for_launcher': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.delete_in_bucket_and_db': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_total_size_file_or_folder_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_file_content_in_bucket': { paramsTuple?: []; params?: {} }
    'game_binary.get_game_binary_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_binary.create_game_binary': { paramsTuple?: []; params?: {} }
    'game_binary.update_game_binary': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_binary.delete_game_binary': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_binary_assignments.get_all_game_binary_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_categories.get_all_game_categories': { paramsTuple?: []; params?: {} }
    'game_category_assignments.get_all_game_category_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_category_assignments.get_all_game_category_assignment_by_category_id': { paramsTuple: [ParamValue]; params: {'categoryId': ParamValue} }
    'game_change_logs.create_game_change_log': { paramsTuple?: []; params?: {} }
    'game_change_logs.update_game_change_log': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_change_logs.delete_game_change_log': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_change_logs.get_all_game_change_logs': { paramsTuple?: []; params?: {} }
    'game_change_logs.get_all_game_change_log_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_change_logs.get_game_change_log_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_change_logs.get_all_game_change_log_by_game_title': { paramsTuple: [ParamValue]; params: {'title': ParamValue} }
    'game_platform_assignments.get_all_game_platform_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_platform_assignments.get_all_game_platform_assignment_by_platform_id': { paramsTuple: [ParamValue]; params: {'platformId': ParamValue} }
    'game_platforms.get_all_game_platforms': { paramsTuple?: []; params?: {} }
    'games.create_games': { paramsTuple?: []; params?: {} }
    'games.get_games_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'games.get_all_games_by_title': { paramsTuple: [ParamValue]; params: {'title': ParamValue} }
    'games.get_game_by_title': { paramsTuple?: []; params?: {} }
    'games.get_all_games': { paramsTuple?: []; params?: {} }
    'games.update_games': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'games.delete_games': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_server.get_all_game_servers': { paramsTuple?: []; params?: {} }
    'game_server.create_game_server': { paramsTuple?: []; params?: {} }
    'game_versions.create_game_version': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_versions.get_all_game_versions_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_versions.get_all_game_versions': { paramsTuple?: []; params?: {} }
    'game_versions.get_game_version': { paramsTuple: [ParamValue,ParamValue]; params: {'gameId': ParamValue,'gameVersionId': ParamValue} }
    'game_versions.update_game_version': { paramsTuple: [ParamValue,ParamValue]; params: {'gameId': ParamValue,'gameVersionId': ParamValue} }
    'game_versions.delete_game_version': { paramsTuple: [ParamValue,ParamValue]; params: {'gameId': ParamValue,'gameVersionId': ParamValue} }
    'game_versions.get_latest_available_version': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'languages.get_all_languages': { paramsTuple?: []; params?: {} }
    'launcher_crz.check_is_available_version_launcher': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'os': ParamValue,'archSystem': ParamValue,'currentVersion': ParamValue} }
    'launcher_crz.download_launcher': { paramsTuple: [ParamValue]; params: {'nameBundle': ParamValue} }
    'maintenance_web_site.update_is_maintenance': { paramsTuple?: []; params?: {} }
    'maintenance_web_site.is_maintenance': { paramsTuple?: []; params?: {} }
    'nats.publish': { paramsTuple?: []; params?: {} }
    'nats.subscribe': { paramsTuple?: []; params?: {} }
    'order_product.create_order_product': { paramsTuple?: []; params?: {} }
    'order_product.update_order_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'order_product.delete_order_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'order_product.get_all_order_products_by_order_id': { paramsTuple: [ParamValue]; params: {'orders_id': ParamValue} }
    'order.create_order': { paramsTuple?: []; params?: {} }
    'order.update_order': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'order.delete_order': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'order.get_all_orders_by_user_id': { paramsTuple: [ParamValue]; params: {'users_id': ParamValue} }
    'order.get_order_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_category.get_all_product_categories': { paramsTuple?: []; params?: {} }
    'product_discount.create_product_discount': { paramsTuple?: []; params?: {} }
    'product_discount.get_product_discount_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_discount.get_all_product_discounts_by_product_id': { paramsTuple: [ParamValue]; params: {'productId': ParamValue} }
    'product_discount.update_product_discount': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_discount.delete_product_discount': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_game_server.get_all_product_game_servers': { paramsTuple?: []; params?: {} }
    'product_game_server.create_product_game_server': { paramsTuple?: []; params?: {} }
    'product.create_product': { paramsTuple?: []; params?: {} }
    'product.get_product_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.get_all_products': { paramsTuple?: []; params?: {} }
    'product.get_product_by_name': { paramsTuple: [ParamValue]; params: {'name': ParamValue} }
    'product.update_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.delete_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.get_game_product_paid_and_owned': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'product.get_all_games_products_paid_and_owned': { paramsTuple?: []; params?: {} }
    'seatyrants.get_info_user': { paramsTuple?: []; params?: {} }
    'stripe.create_payment_intent_stripe': { paramsTuple?: []; params?: {} }
    'stripe.check_proxy_vpn': { paramsTuple?: []; params?: {} }
    'stripe.handle_webhook_stripe': { paramsTuple?: []; params?: {} }
    'ticket_categories.get_all_ticket_categories': { paramsTuple?: []; params?: {} }
    'ticket_responses.create_ticket_responses': { paramsTuple?: []; params?: {} }
    'ticket_responses.get_all_tickets_responses_by_ticket_id': { paramsTuple: [ParamValue]; params: {'ticketId': ParamValue} }
    'tickets.create_tickets': { paramsTuple?: []; params?: {} }
    'tickets.get_tickets_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tickets.get_all_tickets': { paramsTuple?: []; params?: {} }
    'tickets.get_all_tickets_by_user_id': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'tickets.update_ticket_by_id_for_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tickets.get_tickets_count_by_status_open_for_user': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'ticket_statuses.get_all_ticket_statuses': { paramsTuple?: []; params?: {} }
    'user_game_libraries.get_all_users_games_libraries_by_user_id': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'user_game_libraries.add_game_to_user_game_libraries': { paramsTuple?: []; params?: {} }
    'user_roles.get_all_user_roles': { paramsTuple?: []; params?: {} }
    'users.decode_token_return_user': { paramsTuple?: []; params?: {} }
    'users.get_vars_environment_for_user': { paramsTuple?: []; params?: {} }
    'users.get_users_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.get_all_users': { paramsTuple?: []; params?: {} }
    'users.get_all_users_by_username_or_email': { paramsTuple: [ParamValue]; params: {'usernameOrEmail': ParamValue} }
    'users.update_users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.delete_users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update_users_role': { paramsTuple: [ParamValue,ParamValue]; params: {'userId': ParamValue,'roleId': ParamValue} }
  }
  GET: {
    'health': { paramsTuple?: []; params?: {} }
    'carousel.get_all_carousels': { paramsTuple?: []; params?: {} }
    'carousel.get_carousel_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cloud_storage_s_3.get_all_buckets': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.download_file_or_folder_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.stream_download_file_in_bucket_for_launcher': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_presigned_download_url_for_launcher': { paramsTuple?: []; params?: {} }
    'game_binary.get_game_binary_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_binary_assignments.get_all_game_binary_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_categories.get_all_game_categories': { paramsTuple?: []; params?: {} }
    'game_category_assignments.get_all_game_category_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_category_assignments.get_all_game_category_assignment_by_category_id': { paramsTuple: [ParamValue]; params: {'categoryId': ParamValue} }
    'game_change_logs.get_all_game_change_logs': { paramsTuple?: []; params?: {} }
    'game_change_logs.get_all_game_change_log_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_change_logs.get_game_change_log_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_change_logs.get_all_game_change_log_by_game_title': { paramsTuple: [ParamValue]; params: {'title': ParamValue} }
    'game_platform_assignments.get_all_game_platform_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_platform_assignments.get_all_game_platform_assignment_by_platform_id': { paramsTuple: [ParamValue]; params: {'platformId': ParamValue} }
    'game_platforms.get_all_game_platforms': { paramsTuple?: []; params?: {} }
    'games.get_games_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'games.get_all_games_by_title': { paramsTuple: [ParamValue]; params: {'title': ParamValue} }
    'games.get_game_by_title': { paramsTuple?: []; params?: {} }
    'games.get_all_games': { paramsTuple?: []; params?: {} }
    'game_server.get_all_game_servers': { paramsTuple?: []; params?: {} }
    'game_versions.get_all_game_versions_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_versions.get_all_game_versions': { paramsTuple?: []; params?: {} }
    'game_versions.get_game_version': { paramsTuple: [ParamValue,ParamValue]; params: {'gameId': ParamValue,'gameVersionId': ParamValue} }
    'game_versions.get_latest_available_version': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'languages.get_all_languages': { paramsTuple?: []; params?: {} }
    'launcher_crz.check_is_available_version_launcher': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'os': ParamValue,'archSystem': ParamValue,'currentVersion': ParamValue} }
    'launcher_crz.download_launcher': { paramsTuple: [ParamValue]; params: {'nameBundle': ParamValue} }
    'maintenance_web_site.is_maintenance': { paramsTuple?: []; params?: {} }
    'order_product.get_all_order_products_by_order_id': { paramsTuple: [ParamValue]; params: {'orders_id': ParamValue} }
    'order.get_all_orders_by_user_id': { paramsTuple: [ParamValue]; params: {'users_id': ParamValue} }
    'order.get_order_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_category.get_all_product_categories': { paramsTuple?: []; params?: {} }
    'product_discount.get_product_discount_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_discount.get_all_product_discounts_by_product_id': { paramsTuple: [ParamValue]; params: {'productId': ParamValue} }
    'product_game_server.get_all_product_game_servers': { paramsTuple?: []; params?: {} }
    'product.get_product_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.get_all_products': { paramsTuple?: []; params?: {} }
    'product.get_product_by_name': { paramsTuple: [ParamValue]; params: {'name': ParamValue} }
    'product.get_game_product_paid_and_owned': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'product.get_all_games_products_paid_and_owned': { paramsTuple?: []; params?: {} }
    'seatyrants.get_info_user': { paramsTuple?: []; params?: {} }
    'ticket_categories.get_all_ticket_categories': { paramsTuple?: []; params?: {} }
    'ticket_responses.get_all_tickets_responses_by_ticket_id': { paramsTuple: [ParamValue]; params: {'ticketId': ParamValue} }
    'tickets.get_tickets_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tickets.get_all_tickets': { paramsTuple?: []; params?: {} }
    'tickets.get_all_tickets_by_user_id': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'tickets.get_tickets_count_by_status_open_for_user': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'ticket_statuses.get_all_ticket_statuses': { paramsTuple?: []; params?: {} }
    'user_game_libraries.get_all_users_games_libraries_by_user_id': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'user_roles.get_all_user_roles': { paramsTuple?: []; params?: {} }
    'users.decode_token_return_user': { paramsTuple?: []; params?: {} }
    'users.get_vars_environment_for_user': { paramsTuple?: []; params?: {} }
    'users.get_users_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.get_all_users': { paramsTuple?: []; params?: {} }
    'users.get_all_users_by_username_or_email': { paramsTuple: [ParamValue]; params: {'usernameOrEmail': ParamValue} }
  }
  HEAD: {
    'health': { paramsTuple?: []; params?: {} }
    'carousel.get_all_carousels': { paramsTuple?: []; params?: {} }
    'carousel.get_carousel_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'cloud_storage_s_3.get_all_buckets': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.download_file_or_folder_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.stream_download_file_in_bucket_for_launcher': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_presigned_download_url_for_launcher': { paramsTuple?: []; params?: {} }
    'game_binary.get_game_binary_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_binary_assignments.get_all_game_binary_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_categories.get_all_game_categories': { paramsTuple?: []; params?: {} }
    'game_category_assignments.get_all_game_category_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_category_assignments.get_all_game_category_assignment_by_category_id': { paramsTuple: [ParamValue]; params: {'categoryId': ParamValue} }
    'game_change_logs.get_all_game_change_logs': { paramsTuple?: []; params?: {} }
    'game_change_logs.get_all_game_change_log_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_change_logs.get_game_change_log_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_change_logs.get_all_game_change_log_by_game_title': { paramsTuple: [ParamValue]; params: {'title': ParamValue} }
    'game_platform_assignments.get_all_game_platform_assignment_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_platform_assignments.get_all_game_platform_assignment_by_platform_id': { paramsTuple: [ParamValue]; params: {'platformId': ParamValue} }
    'game_platforms.get_all_game_platforms': { paramsTuple?: []; params?: {} }
    'games.get_games_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'games.get_all_games_by_title': { paramsTuple: [ParamValue]; params: {'title': ParamValue} }
    'games.get_game_by_title': { paramsTuple?: []; params?: {} }
    'games.get_all_games': { paramsTuple?: []; params?: {} }
    'game_server.get_all_game_servers': { paramsTuple?: []; params?: {} }
    'game_versions.get_all_game_versions_by_game_id': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'game_versions.get_all_game_versions': { paramsTuple?: []; params?: {} }
    'game_versions.get_game_version': { paramsTuple: [ParamValue,ParamValue]; params: {'gameId': ParamValue,'gameVersionId': ParamValue} }
    'game_versions.get_latest_available_version': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'languages.get_all_languages': { paramsTuple?: []; params?: {} }
    'launcher_crz.check_is_available_version_launcher': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'os': ParamValue,'archSystem': ParamValue,'currentVersion': ParamValue} }
    'launcher_crz.download_launcher': { paramsTuple: [ParamValue]; params: {'nameBundle': ParamValue} }
    'maintenance_web_site.is_maintenance': { paramsTuple?: []; params?: {} }
    'order_product.get_all_order_products_by_order_id': { paramsTuple: [ParamValue]; params: {'orders_id': ParamValue} }
    'order.get_all_orders_by_user_id': { paramsTuple: [ParamValue]; params: {'users_id': ParamValue} }
    'order.get_order_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_category.get_all_product_categories': { paramsTuple?: []; params?: {} }
    'product_discount.get_product_discount_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_discount.get_all_product_discounts_by_product_id': { paramsTuple: [ParamValue]; params: {'productId': ParamValue} }
    'product_game_server.get_all_product_game_servers': { paramsTuple?: []; params?: {} }
    'product.get_product_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.get_all_products': { paramsTuple?: []; params?: {} }
    'product.get_product_by_name': { paramsTuple: [ParamValue]; params: {'name': ParamValue} }
    'product.get_game_product_paid_and_owned': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'product.get_all_games_products_paid_and_owned': { paramsTuple?: []; params?: {} }
    'seatyrants.get_info_user': { paramsTuple?: []; params?: {} }
    'ticket_categories.get_all_ticket_categories': { paramsTuple?: []; params?: {} }
    'ticket_responses.get_all_tickets_responses_by_ticket_id': { paramsTuple: [ParamValue]; params: {'ticketId': ParamValue} }
    'tickets.get_tickets_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tickets.get_all_tickets': { paramsTuple?: []; params?: {} }
    'tickets.get_all_tickets_by_user_id': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'tickets.get_tickets_count_by_status_open_for_user': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'ticket_statuses.get_all_ticket_statuses': { paramsTuple?: []; params?: {} }
    'user_game_libraries.get_all_users_games_libraries_by_user_id': { paramsTuple: [ParamValue]; params: {'userId': ParamValue} }
    'user_roles.get_all_user_roles': { paramsTuple?: []; params?: {} }
    'users.decode_token_return_user': { paramsTuple?: []; params?: {} }
    'users.get_vars_environment_for_user': { paramsTuple?: []; params?: {} }
    'users.get_users_by_id': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.get_all_users': { paramsTuple?: []; params?: {} }
    'users.get_all_users_by_username_or_email': { paramsTuple: [ParamValue]; params: {'usernameOrEmail': ParamValue} }
  }
  POST: {
    'auth.sign_up': { paramsTuple?: []; params?: {} }
    'auth.sign_in': { paramsTuple?: []; params?: {} }
    'auth.sign_out': { paramsTuple?: []; params?: {} }
    'auth.verify_code': { paramsTuple?: []; params?: {} }
    'auth.forgot_password': { paramsTuple?: []; params?: {} }
    'auth.reset_password': { paramsTuple?: []; params?: {} }
    'auth.send_mail_to_modify_email': { paramsTuple?: []; params?: {} }
    'auth.reset_email': { paramsTuple?: []; params?: {} }
    'auth.resend_new_code_verification_account': { paramsTuple?: []; params?: {} }
    'carousel.create_carousel': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_list_files_object_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.upload_file_or_folder_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.delete_in_bucket_and_db': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_total_size_file_or_folder_in_bucket': { paramsTuple?: []; params?: {} }
    'cloud_storage_s_3.get_file_content_in_bucket': { paramsTuple?: []; params?: {} }
    'game_binary.create_game_binary': { paramsTuple?: []; params?: {} }
    'game_change_logs.create_game_change_log': { paramsTuple?: []; params?: {} }
    'games.create_games': { paramsTuple?: []; params?: {} }
    'game_server.create_game_server': { paramsTuple?: []; params?: {} }
    'game_versions.create_game_version': { paramsTuple: [ParamValue]; params: {'gameId': ParamValue} }
    'nats.publish': { paramsTuple?: []; params?: {} }
    'nats.subscribe': { paramsTuple?: []; params?: {} }
    'order_product.create_order_product': { paramsTuple?: []; params?: {} }
    'order.create_order': { paramsTuple?: []; params?: {} }
    'product_discount.create_product_discount': { paramsTuple?: []; params?: {} }
    'product_game_server.create_product_game_server': { paramsTuple?: []; params?: {} }
    'product.create_product': { paramsTuple?: []; params?: {} }
    'stripe.create_payment_intent_stripe': { paramsTuple?: []; params?: {} }
    'stripe.check_proxy_vpn': { paramsTuple?: []; params?: {} }
    'stripe.handle_webhook_stripe': { paramsTuple?: []; params?: {} }
    'ticket_responses.create_ticket_responses': { paramsTuple?: []; params?: {} }
    'tickets.create_tickets': { paramsTuple?: []; params?: {} }
    'user_game_libraries.add_game_to_user_game_libraries': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'carousel.update_carousel': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_binary.update_game_binary': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_change_logs.update_game_change_log': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'games.update_games': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_versions.update_game_version': { paramsTuple: [ParamValue,ParamValue]; params: {'gameId': ParamValue,'gameVersionId': ParamValue} }
    'maintenance_web_site.update_is_maintenance': { paramsTuple?: []; params?: {} }
    'order_product.update_order_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'order.update_order': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_discount.update_product_discount': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.update_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tickets.update_ticket_by_id_for_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update_users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update_users_role': { paramsTuple: [ParamValue,ParamValue]; params: {'userId': ParamValue,'roleId': ParamValue} }
  }
  DELETE: {
    'carousel.delete': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_binary.delete_game_binary': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_change_logs.delete_game_change_log': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'games.delete_games': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'game_versions.delete_game_version': { paramsTuple: [ParamValue,ParamValue]; params: {'gameId': ParamValue,'gameVersionId': ParamValue} }
    'order_product.delete_order_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'order.delete_order': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product_discount.delete_product_discount': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'product.delete_product': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.delete_users': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}