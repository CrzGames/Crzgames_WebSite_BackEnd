import ProxyCheck, { ProxyCheckResponse, IPAddressInfo } from 'proxycheck-ts'
import Env from '@ioc:Adonis/Core/Env'

const proxyCheck: ProxyCheck = new ProxyCheck({ api_key: Env.get('PROXY_CHECK_IO_API_KEY') })

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

export class ProxyCheckIOService {
  public static async checkProxyVPN(ip: string): Promise<ResponseProxyCheckIO> {
    try {
      const response: ProxyCheckResponse = await proxyCheck.checkIP(ip, {
        asn: 1, // Returns ASN, IP info, etc.
        vpn: 3, // Check for VPN & Proxy
      })

      // Extract IP check results
      const ipData: IPAddressInfo = response[ip]
      if (ipData) {
        // Create response object
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
      }

      // Default response if no data is available for the IP
      return {
        continent: '',
        continentCode: '',
        country: '',
        isocode: '',
        region: '',
        city: '',
        currency: {
          code: '',
          name: '',
          symbol: '',
        },
        isProxyOrVPN: Env.get('NODE_ENV') !== 'development', // Default to true in production
      } as ResponseProxyCheckIO
    } catch (error) {
      console.error('Error checking IP:', error)
      throw new Error('Failed to check IP for VPN/Proxy status')
    }
  }
}
