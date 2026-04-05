import React from 'react'
import { GenericImportForm } from 'src/features/import/GenericImportForm'
import { render, screen } from 'src/test/test-utils'
<<<<<<< HEAD
import { noOpFunction } from '@l.x/utils/src/test/utils'
import { GuiProvider } from '@luxfi/wallet/src/providers/gui-provider'
=======
import { noOpFunction } from 'utilities/src/test/utils'
import { TamaguiProvider } from 'wallet/src/providers/tamagui-provider'
>>>>>>> upstream/main

describe(GenericImportForm, () => {
  it('renders a placeholder when there is no value', async () => {
    const tree = render(
<<<<<<< HEAD
      <GuiProvider>
=======
      <TamaguiProvider>
>>>>>>> upstream/main
        <GenericImportForm
          errorMessage={undefined}
          placeholderLabel="seed phrase"
          value={undefined}
          onChange={noOpFunction}
        />
<<<<<<< HEAD
      </GuiProvider>,
=======
      </TamaguiProvider>,
>>>>>>> upstream/main
    )

    expect(await screen.findByText('seed phrase')).toBeDefined()
    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('renders a value', async () => {
    render(
<<<<<<< HEAD
      <GuiProvider>
=======
      <TamaguiProvider>
>>>>>>> upstream/main
        <GenericImportForm
          errorMessage={undefined}
          placeholderLabel="seed phrase"
          value="hello"
          onChange={noOpFunction}
        />
<<<<<<< HEAD
      </GuiProvider>,
=======
      </TamaguiProvider>,
>>>>>>> upstream/main
    )

    expect(await screen.queryByText('seed phrase')).toBeNull()
    expect(await screen.findByDisplayValue('hello')).toBeDefined()
  })

  it('renders an error message', async () => {
    render(
<<<<<<< HEAD
      <GuiProvider>
=======
      <TamaguiProvider>
>>>>>>> upstream/main
        <GenericImportForm
          errorMessage="there is an error"
          placeholderLabel="seed phrase"
          value="wrong value"
          onChange={noOpFunction}
        />
<<<<<<< HEAD
      </GuiProvider>,
=======
      </TamaguiProvider>,
>>>>>>> upstream/main
    )

    expect(await screen.findByText('there is an error')).toBeDefined()
  })
})
