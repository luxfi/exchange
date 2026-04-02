import { getStorageDriver } from '@luxexchange/api/src/storage/getStorageDriver'
import { createLxIdentifierService, LxIdentifierService } from '@luxexchange/sessions'

const LX_IDENTIFIER_KEY = 'LX_IDENTIFIER'

function provideLxIdentifierService(): LxIdentifierService {
  const driver = getStorageDriver()

  const service = createLxIdentifierService({
    getLxIdentifier: async () => {
      const identifier = await driver.get(LX_IDENTIFIER_KEY)
      return identifier || null
    },
    setLxIdentifier: async (identifier: string) => {
      await driver.set(LX_IDENTIFIER_KEY, identifier)
    },
    removeLxIdentifier: async () => {
      await driver.remove(LX_IDENTIFIER_KEY)
    },
  })

  return service
}

export { provideLxIdentifierService }
