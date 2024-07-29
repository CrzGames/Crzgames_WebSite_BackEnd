import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CheckProxyVPNValidator {
  public schema = schema.create({
    ip: schema.string({}, [
      rules.ip(), // Validates the string as an IP address
      rules.required(), // The field is required
    ]),
  })

  public messages = {
    'ip.required': 'An IP address is required',
    'ip.ip': 'A valid IP address is required',
  }
}
