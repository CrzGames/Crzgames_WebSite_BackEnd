import ProxyCheck from 'proxycheck-ts'
import type { ProxyCheckResponse, IPAddressInfo } from 'proxycheck-ts'
import env from '#start/env'

const proxyCheck: ProxyCheck = new ProxyCheck({ api_key: env.get('PROXY_CHECK_IO_API_KEY') })

/**
 * @typedef {object} ResponseProxyCheckIO
 * @property {string} continent - Le continent de l'adresse IP.
 * @property {string} continentCode - Le code du continent de l'adresse IP.
 * @property {string} country - Le pays de l'adresse IP.
 * @property {string} isocode - Le code ISO du pays de l'adresse IP.
 * @property {string} region - La region de l'adresse IP.
 * @property {string} city - La ville de l'adresse IP.
 * @property {object} currency - Les informations sur la devise associee a l'adresse IP.
 * @property {string} currency.code - Le code de la devise.
 * @property {string} currency.name - Le nom de la devise.
 * @property {string} currency.symbol - Le symbole de la devise.
 * @property {boolean} isProxyOrVPN - Indique si l'adresse IP est un proxy ou un VPN.
 */
export type ResponseProxyCheckIO = {
  continent: string
  continentCode: string
  country: string
  isocode: string
  region: string
  city: string
  currency: {
    code: string
    name: string
    symbol: string
  }
  isProxyOrVPN: boolean
}

/**
 * Service pour verifier si une adresse IP est un proxy ou un VPN en utilisant ProxyCheck.io.
 * @class ProxyCheckIOService
 */
export class ProxyCheckIOService {
  /**
   * Verifie si une adresse IP est un proxy ou un VPN.
   * @param {string} ip - L'adresse IP a verifier.
   * @returns {Promise<ResponseProxyCheckIO>} - Les informations sur l'adresse IP, y compris si c'est un proxy ou un VPN.
   * @throws {Error} Si la verification echoue.
   */
  public static async checkProxyVPN(ip: string): Promise<ResponseProxyCheckIO> {
    try {
      const response: ProxyCheckResponse = await proxyCheck.checkIP(ip, {
        asn: 1,
        vpn: 3,
      })

      const ipData: IPAddressInfo = response[ip]

      return {
        continent: ipData.continent,
        continentCode: ipData.continentcode,
        country: ipData.country,
        isocode: ipData.isocode,
        region: ipData.region,
        city: ipData.city,
        currency: {
          code: ipData.currency.code,
          name: ipData.currency.name,
          symbol: ipData.currency.symbol,
        },
        isProxyOrVPN: ipData.proxy === 'yes' || ipData.vpn === 'yes',
      } as ResponseProxyCheckIO
    } catch (error) {
      console.error('Error checking IP:', error)
      throw new Error('Failed to check IP for VPN/Proxy status')
    }
  }
}
