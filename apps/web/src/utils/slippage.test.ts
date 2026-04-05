<<<<<<< HEAD
import { Percent } from '@luxamm/sdk-core'
=======
import { Percent } from '@uniswap/sdk-core'
>>>>>>> upstream/main
import { toSlippagePercent } from '~/utils/slippage'

describe('slippage function', () => {
  it('should turn slippage strings into Percents correctly', async () => {
    const input = '0.5'
    const percent = new Percent(5, 1000)
    expect(toSlippagePercent(input).equalTo(percent)).toBeTruthy()
  })
})
