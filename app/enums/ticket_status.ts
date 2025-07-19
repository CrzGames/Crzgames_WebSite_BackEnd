/**
 * Enumération pour représenter les différents statuts des tickets.
 * @enum {string}
 * @property {string} OPEN - Le ticket est ouvert.
 * @property {string} PENDING - Le ticket est en attente.
 * @property {string} CLOSE - Le ticket est fermé.
 */
export enum TicketStatus {
  OPEN = 'Open',
  PENDING = 'Pending',
  CLOSE = 'Closed',
}
