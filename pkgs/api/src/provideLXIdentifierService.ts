import { getStorageDriver } from '@l.x/api/src/storage/getStorageDriver'
import { createLXIdentifierService, LXIdentifierService } from '@l.x/sessions'

const LX_IDENTIFIER_KEY = 'LX_IDENTIFIER'

function provideLXIdentifierService(): LXIdentifierService {
  const driver = getStorageDriver()

  const service = createLXIdentifierService({
    getLXIdentifier: async () => {
      const identifier = await driver.get(LX_IDENTIFIER_KEY)
      return identifier || null
    },
    setLXIdentifier: async (identifier: string) => {
      await driver.set(LX_IDENTIFIER_KEY, identifier)
    },
    removeLXIdentifier: async () => {
      await driver.remove(LX_IDENTIFIER_KEY)
    },
  })

  return service
}

export { provideLXIdentifierService }
