import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // 🔧 Global rules
  required: 'The {{ field }} field is required',
  string: 'The value of {{ field }} field must be a string',
  number: 'The value of {{ field }} field must be a number',
  email: 'The value is not a valid email address',
  exists: 'The {{ field }} must reference an existing record',

  // 🔧 Field-specific rules
  'email.required': 'Email is required',
  'email.email': 'Email format is not valid',
  'email.exists': 'No account found with this email',

  'code.required': 'Code is required',
  'code.number': 'Code must be a number',

  'username.required': 'Please choose a username for your account',

  // 🔧 Ajout pour ResetPasswordValidator
  'token.required': 'Token is required',
  'token.exists': 'Invalid or expired token',
  'newPassword.required': 'New password is required',
  'newPassword.minLength': 'New password must be at least 8 characters long',
  'newPassword.confirmed': 'New password confirmation does not match',
  'newPassword.strongPassword':
    'The password must contain at least one uppercase letter, one number, and one special character',

  // 🔧 Ajout pour SignUpValidator
  'username.minLength': 'Username must be at least 4 characters long',
  'username.maxLength': 'Username cannot exceed 22 characters',
  'username.unique': 'This username is already in use',
  'email.unique': 'This email is already in use',
  'password.required': 'Password is required',
  'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères.',
  'password.confirmed': 'Password confirmation does not match',
  'password.strongPassword':
    'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.',
  'ip_address.required': 'IP address is required',
  'currency_code.required': 'Currency code is required',

  // 🔧 Ajout pour CreateCarouselValidator et UpdateCarouselValidator
  'imagePathFilename.required': 'Image path filename is required',
  'imageBucketName.required': 'Image bucket name is required',
  'imageFilesId.required': 'Image files ID is required',

  // 🔧 Ajout pour CreateGameValidator
  'title.required': 'Le titre est requis.',
  'description.required': 'La description est requise.',
  'trailerPathFilename.required': 'Le nom du fichier du trailer est requis.',
  'trailerBucketName.required': 'Le nom du bucket du trailer est requis.',
  'picturePathFilename.required': "Le nom du fichier de l'image est requis.",
  'pictureBucketName.required': "Le nom du bucket de l'image est requis.",
  'logoPathFilename.required': 'Le nom du fichier du logo est requis.',
  'logoBucketName.required': 'Le nom du bucket du logo est requis.',
  'categoryIds.required': 'Au moins une catégorie est requise.',
  'categoryIds.array': 'Les catégories doivent être une liste.',
  'categoryIds.*.number': 'Chaque ID de catégorie doit être un nombre.',
  'platformIds.required': 'Au moins une plateforme est requise.',
  'platformIds.array': 'Les plateformes doivent être une liste.',
  'platformIds.*.number': 'Chaque ID de plateforme doit être un nombre.',

  // 🔧 Ajout pour DeleteGamesValidator et GetGamesByIdValidator
  'id.required': 'Game ID is required',
  'id.exists': 'Game does not exist',

  // 🔧 Ajout pour UpdateGameValidator
  'trailerFilesId.required': 'Trailer files ID is required',
  'logoFilesId.required': 'Logo files ID is required',
  'pictureFileId.required': 'Picture file ID is required',
  'binaries.required': 'Au moins un binaire est requis.',
  'binaries.array': 'Les binaires doivent être une liste.',
  'binaries.*.pathfilename.required': 'Le chemin du binaire est requis.',
  'binaries.*.platformId.required': "L'ID de la plateforme est requis.",
  'binaries.*.platformId.number': "L'ID de la plateforme doit être un nombre.",
  'binaries.*.bucketName.required': 'Le nom du bucket du binaire est requis.',

  // 🔧 Ajout pour CreateGameBinaryValidator et UpdateGameBinaryValidator
  'gameId.required': 'Game ID is required',
  'gameId.exists': 'Game does not exist',
  'binary.required': 'Binary is required',
  'binary.pathfilename.required': 'Binary pathfilename is required',
  'binary.platformId.required': 'Binary platformId is required',
  'binary.platformId.number': 'Binary platformId must be a number',
  'binary.bucketName.required': 'Binary bucketName is required',

  // 🔧 Ajout pour GetAllGameCategoryAssignmentByCategoryIdValidator
  'categoryId.required': 'Category ID is required',
  'categoryId.number': 'Category ID should be a number',
  'categoryId.exists': 'Category with this ID does not exist',

  // 🔧 Ajout pour CreateGameVersionValidator
  'version.required': 'La version est requise.',
  'is_available.required': 'Le statut de disponibilité est requis.',
  'is_available.boolean': 'Le statut de disponibilité doit être un booléen.',

  // 🔧 Ajout pour CreateOrderValidator
  'users_id.required': 'User ID is required',
  'users_id.exists': 'User does not exist',
  'currency.required': 'Currency is required and must be a valid ISO currency code',
  'status_order.required': 'Order status is required',
  'status_order.enum': 'Order status must be one of: Paid, Canceled, Failed',

  // 🔧 Ajout pour CreateProductValidator
  'name.required': 'The name is required',
  'name.maxLength': 'The name cannot be longer than 255 characters',
  'games_id.exists': 'The specified game does not exist',
  'product_categories_id.required': 'The product category ID is required',
  'price.required': 'The price is required',
  'price.number': 'The price must be a valid number',
  'bucket_name.required': 'The bucket_name is required',
  'pathFilename.required': 'The pathFilename is required',
})
