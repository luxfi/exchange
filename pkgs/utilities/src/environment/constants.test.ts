import { localDevDatadogEnabled } from '@luxfi/utilities/src/environment/constants'

describe('getLocalDevDatadogEnabled', () => {
  it('should always return false. This test is here to prevent committing this to repo to true.', () => {
    expect(localDevDatadogEnabled).toBe(false)
  })
})
