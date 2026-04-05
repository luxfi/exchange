import React from 'react'
import { AccountSwitcher } from 'src/app/modals/AccountSwitcherModal'
import { preloadedMobileState } from 'src/test/fixtures'
import { cleanup, render } from 'src/test/test-utils'
<<<<<<< HEAD
import { noOpFunction } from '@l.x/utils/src/test/utils'
import { ACCOUNT } from '@luxfi/wallet/src/test/fixtures'
=======
import { noOpFunction } from 'utilities/src/test/utils'
import { ACCOUNT } from 'wallet/src/test/fixtures'
>>>>>>> upstream/main

const preloadedState = preloadedMobileState({
  account: ACCOUNT,
})

// TODO [MOB-259]: Figure out how to do snapshot tests when there is a Modal
describe(AccountSwitcher, () => {
  it('renders correctly', async () => {
    const tree = render(<AccountSwitcher onClose={noOpFunction} />, { preloadedState })

    expect(tree.toJSON()).toMatchSnapshot()
    cleanup()
  })
})
