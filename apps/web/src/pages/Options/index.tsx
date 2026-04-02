import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import {
  SymbolSearch,
  ExpirationBar,
  OptionsChain,
  OptionsOrderForm,
  PositionsTable,
  StrategyPanel,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  type Token,
  type OptionStrike,
  type OptionPosition,
} from '@l.x/options'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'

type BottomTab = 'positions' | 'strategy'

export default function OptionsPage() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const [underlying, setUnderlying] = useState<Token | null>(null)
  const [selectedExpiration, setSelectedExpiration] = useState<string | null>(null)
  const [selectedStrike, setSelectedStrike] = useState<number | null>(null)
  const [selectedSide, setSelectedSide] = useState<'call' | 'put' | null>(null)
  const [bottomTab, setBottomTab] = useState<BottomTab>('positions')

  const effectiveChainId = chainId || UniverseChainId.Lux
  const chainInfo = getChainInfo(effectiveChainId)

  // Tokens for the current chain — stub until backend wired
  const tokens: Token[] = useMemo(() => {
    const native = chainInfo?.nativeCurrency
    if (!native) return []
    return [{ symbol: native.symbol, name: native.name, decimals: native.decimals, address: '0x0' }]
  }, [chainInfo])

  // Expirations for selected underlying (backend placeholder)
  const expirations: string[] = useMemo(() => {
    if (!underlying) return []
    return []
  }, [underlying])

  // Strikes for selected underlying + expiration (backend placeholder)
  const strikes: OptionStrike[] = useMemo(() => {
    if (!underlying || !selectedExpiration) return []
    return []
  }, [underlying, selectedExpiration])

  const spotPrice = null as number | null
  const positions: OptionPosition[] = []

  useEffect(() => {
    setSelectedExpiration(null)
    setSelectedStrike(null)
    setSelectedSide(null)
  }, [underlying])

  useEffect(() => {
    setSelectedStrike(null)
    setSelectedSide(null)
  }, [selectedExpiration])

  const handleSelectOption = useCallback((strike: number, side: 'call' | 'put') => {
    setSelectedStrike(strike)
    setSelectedSide(side)
  }, [])

  return (
    <div style={{ padding: '16px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Top bar: symbol selector + spot info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SymbolSearch selectedToken={underlying} onSelect={setUnderlying} tokens={tokens} />
          {underlying && spotPrice !== null && (
            <span style={{ fontSize: 14, fontFamily: 'monospace' }}>
              Spot: {spotPrice.toFixed(2)}
            </span>
          )}
        </div>
        {underlying && (
          <span style={{ fontSize: 12, opacity: 0.6 }}>Chain {effectiveChainId}</span>
        )}
      </div>

      <ExpirationBar
        expirations={expirations}
        selected={selectedExpiration}
        onSelect={setSelectedExpiration}
      />

      {/* Main content: chain + order form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16, marginTop: 16 }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 14, fontWeight: 500 }}>
              Options Chain
              {underlying && selectedExpiration && (
                <span style={{ marginLeft: 8, opacity: 0.6, fontWeight: 400 }}>
                  {underlying.symbol} — {selectedExpiration}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OptionsChain
              strikes={strikes}
              spotPrice={spotPrice}
              onSelectOption={handleSelectOption}
              selectedStrike={selectedStrike}
              selectedSide={selectedSide}
            />
          </CardContent>
        </Card>

        <div>
          <OptionsOrderForm
            underlying={underlying?.symbol ?? null}
            strike={selectedStrike}
            optionSide={selectedSide}
            expiration={selectedExpiration}
          />
        </div>
      </div>

      {/* Bottom: positions / strategy tabs */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--spore-neutral3, #333)', marginBottom: 12 }}>
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
              bottomTab === 'positions' ? 'border-current' : 'border-transparent opacity-60',
            )}
            onClick={() => setBottomTab('positions')}
          >
            Positions
          </button>
          <button
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
              bottomTab === 'strategy' ? 'border-current' : 'border-transparent opacity-60',
            )}
            onClick={() => setBottomTab('strategy')}
          >
            Strategy Builder
          </button>
        </div>
        {bottomTab === 'positions' && <PositionsTable positions={positions} />}
        {bottomTab === 'strategy' && (
          <StrategyPanel underlying={underlying?.symbol ?? null} expiration={selectedExpiration} />
        )}
      </div>
    </div>
  )
}
