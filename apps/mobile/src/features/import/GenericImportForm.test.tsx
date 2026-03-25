import React from 'react'
import { GenericImportForm } from 'src/features/import/GenericImportForm'
import { render, screen } from 'src/test/test-utils'
import { noOpFunction } from 'utilities/src/test/utils'
import { GuiProvider } from 'wallet/src/providers/gui-provider'

describe(GenericImportForm, () => {
  it('renders a placeholder when there is no value', async () => {
    const tree = render(
      <GuiProvider>
        <GenericImportForm
          errorMessage={undefined}
          placeholderLabel="seed phrase"
          value={undefined}
          onChange={noOpFunction}
        />
      </GuiProvider>,
    )

    expect(await screen.findByText('seed phrase')).toBeDefined()
    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('renders a value', async () => {
    render(
      <GuiProvider>
        <GenericImportForm
          errorMessage={undefined}
          placeholderLabel="seed phrase"
          value="hello"
          onChange={noOpFunction}
        />
      </GuiProvider>,
    )

    expect(await screen.queryByText('seed phrase')).toBeNull()
    expect(await screen.findByDisplayValue('hello')).toBeDefined()
  })

  it('renders an error message', async () => {
    render(
      <GuiProvider>
        <GenericImportForm
          errorMessage="there is an error"
          placeholderLabel="seed phrase"
          value="wrong value"
          onChange={noOpFunction}
        />
      </GuiProvider>,
    )

    expect(await screen.findByText('there is an error')).toBeDefined()
  })
})
