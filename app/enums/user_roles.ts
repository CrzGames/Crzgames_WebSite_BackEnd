/**
 * Enumération pour représenter les différents rôles des utilisateurs.
 * @enum {string}
 * @property {string} CLIENT - Le rôle de client.
 * @property {string} MODERATOR - Le rôle de modérateur.
 * @property {string} STAFF - Le rôle de personnel.
 * @property {string} ADMIN - Le rôle d'administrateur.
 */
export enum UserRoles {
  CLIENT = 'Client',
  MODERATOR = 'Moderator',
  STAFF = 'Staff',
  ADMIN = 'Admin',
}
