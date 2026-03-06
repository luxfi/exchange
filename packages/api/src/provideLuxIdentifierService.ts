import { getStorageDriver } from '@luxfi/api/src/storage/getStorageDriver'
import { createLuxIdentifierService, LuxIdentifierService } from '@luxfi/sessions'

const LUX_IDENTIFIER_KEY = 'LUX_IDENTIFIER'

function provideLuxIdentifierService(): LuxIdentifierService {
  const driver = getStorageDriver()

  const service = createLuxIdentifierService({
    getLuxIdentifier: async () => {
      const identifier = await driver.get(LUX_IDENTIFIER_KEY)
      return identifier || null
    },
    setLuxIdentifier: async (identifier: string) => {
      await driver.set(LUX_IDENTIFIER_KEY, identifier)
    },
    removeLuxIdentifier: async () => {
      await driver.remove(LUX_IDENTIFIER_KEY)
    },
  })

  return service
}

export { provideLuxIdentifierService }
