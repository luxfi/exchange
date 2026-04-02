import { getStorageDriver } from '@l.x/api/src/storage/getStorageDriver'
import { createDeviceIdService, DeviceIdService } from '@l.x/sessions'

const DEVICE_ID_KEY = 'LX_DEVICE_ID'

function provideDeviceIdService(): DeviceIdService {
  const driver = getStorageDriver()

  const service = createDeviceIdService({
    getDeviceId: async () => {
      const deviceId = await driver.get(DEVICE_ID_KEY)
      return deviceId || ''
    },
    setDeviceId: async (deviceId: string) => {
      await driver.set(DEVICE_ID_KEY, deviceId)
    },
    removeDeviceId: async () => {
      await driver.remove(DEVICE_ID_KEY)
    },
  })

  return service
}

export { provideDeviceIdService }
