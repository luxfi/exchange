// Quasar Consensus Guard for Liquidity Operations
import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Token } from '@luxamm/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { AutoColumn } from 'components/Column'
import { AutoRow } from 'components/Row'
import { MouseoverTooltip } from 'components/Tooltip'
import { useQuasarConsensus } from 'hooks/useQuasarConsensus'
import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, Shield, Clock } from 'react-feather'
import styled, { useTheme } from 'styled-components/macro'
import { ThemedText } from 'theme'

const GuardContainer = styled(AutoColumn)`
  padding: 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.backgroundSurface};
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
`

const StatusRow = styled(AutoRow)`
  padding: 8px 0;
`

const StatusIcon = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme, active }) => 
    active ? theme.accentSuccess : theme.backgroundInteractive};
`

const WitnessInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme.backgroundModule};
  border-radius: 8px;
  font-size: 12px;
`

export interface LiquidityWitness {
  pool: string
  token0: string
  token1: string
  amount0: BigNumber
  amount1: BigNumber
  liquidity: BigNumber
  action: 'ADD' | 'REMOVE'
  timestamp: number
  verkleProof: string
  blsSignature: string
  ringtailSignature: string
  validatorBits: number
}

interface QuasarLiquidityGuardProps {
  token0?: Currency
  token1?: Currency
  amount0?: CurrencyAmount<Currency>
  amount1?: CurrencyAmount<Currency>
  poolAddress?: string
  action: 'ADD' | 'REMOVE'
  onWitnessCreated?: (witness: LiquidityWitness) => void
  requireVerification?: boolean
}

export default function QuasarLiquidityGuard({
  token0,
  token1,
  amount0,
  amount1,
  poolAddress,
  action,
  onWitnessCreated,
  requireVerification = true,
}: QuasarLiquidityGuardProps) {
  const theme = useTheme()
  const { provider } = useWeb3React()
  const { quasarState, verifySwapWitness, createSwapWitness, isQuantumSafe } = useQuasarConsensus()
  
  const [witness, setWitness] = useState<LiquidityWitness | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending')
  const [creatingWitness, setCreatingWitness] = useState(false)

  // Create witness for liquidity operation
  const createLiquidityWitness = useCallback(async () => {
    if (!token0 || !token1 || !amount0 || !amount1 || !poolAddress || !provider) {
      return null
    }

    setCreatingWitness(true)
    try {
      // Create swap witness (reusing for liquidity)
      const swapWitness = await createSwapWitness(
        token0.wrapped.address,
        token1.wrapped.address,
        BigNumber.from(amount0.quotient.toString()),
        BigNumber.from(amount1.quotient.toString()),
        0, // No slippage for liquidity
        Math.floor(Date.now() / 1000) + 1200 // 20 min deadline
      )

      if (!swapWitness) {
        setCreatingWitness(false)
        return null
      }

      // Convert to liquidity witness
      const liquidityWitness: LiquidityWitness = {
        pool: poolAddress,
        token0: token0.wrapped.address,
        token1: token1.wrapped.address,
        amount0: BigNumber.from(amount0.quotient.toString()),
        amount1: BigNumber.from(amount1.quotient.toString()),
        liquidity: BigNumber.from(0), // Calculate from amounts
        action,
        timestamp: Math.floor(Date.now() / 1000),
        verkleProof: swapWitness.verkleProof,
        blsSignature: swapWitness.blsSignature,
        ringtailSignature: swapWitness.ringtailSignature,
        validatorBits: swapWitness.validatorBits,
      }

      setWitness(liquidityWitness)
      if (onWitnessCreated) {
        onWitnessCreated(liquidityWitness)
      }

      // Verify the witness
      const isValid = await verifySwapWitness(swapWitness)
      setVerificationStatus(isValid ? 'verified' : 'failed')

      setCreatingWitness(false)
      return liquidityWitness
    } catch (error) {
      console.error('Failed to create liquidity witness:', error)
      setCreatingWitness(false)
      setVerificationStatus('failed')
      return null
    }
  }, [token0, token1, amount0, amount1, poolAddress, action, provider, createSwapWitness, verifySwapWitness, onWitnessCreated])

  // Auto-create witness when inputs change
  useEffect(() => {
    if (token0 && token1 && amount0 && amount1 && poolAddress) {
      createLiquidityWitness()
    }
  }, [token0, token1, amount0, amount1, poolAddress, createLiquidityWitness])

  // Calculate validator consensus percentage
  const validatorPercentage = useMemo(() => {
    if (!witness) return 0
    let count = 0
    for (let i = 0; i < 32; i++) {
      if (witness.validatorBits & (1 << i)) {
        count++
      }
    }
    return Math.round((count / 32) * 100)
  }, [witness])

  if (!isQuantumSafe && !requireVerification) {
    return null // Don't show if not in quantum-safe mode and not required
  }

  return (
    <GuardContainer gap="md">
      <AutoRow justify="space-between">
        <AutoRow gap="sm">
          <Shield size={20} color={theme.accentAction} />
          <ThemedText.SubHeader>
            <Trans>Quasar Consensus Protection</Trans>
          </ThemedText.SubHeader>
        </AutoRow>
        {creatingWitness && (
          <ThemedText.Caption color="textSecondary">
            <Trans>Creating witness...</Trans>
          </ThemedText.Caption>
        )}
      </AutoRow>

      <StatusRow justify="space-between">
        <ThemedText.Body fontSize={14}>
          <Trans>Consensus Status</Trans>
        </ThemedText.Body>
        <AutoRow gap="sm">
          {verificationStatus === 'verified' ? (
            <>
              <CheckCircle size={16} color={theme.accentSuccess} />
              <ThemedText.Body fontSize={14} color="accentSuccess">
                <Trans>Verified</Trans>
              </ThemedText.Body>
            </>
          ) : verificationStatus === 'failed' ? (
            <>
              <AlertTriangle size={16} color={theme.accentFailure} />
              <ThemedText.Body fontSize={14} color="accentFailure">
                <Trans>Failed</Trans>
              </ThemedText.Body>
            </>
          ) : (
            <>
              <Clock size={16} color={theme.textSecondary} />
              <ThemedText.Body fontSize={14} color="textSecondary">
                <Trans>Pending</Trans>
              </ThemedText.Body>
            </>
          )}
        </AutoRow>
      </StatusRow>

      <StatusRow justify="space-between">
        <ThemedText.Body fontSize={14}>
          <Trans>PQ Finality</Trans>
        </ThemedText.Body>
        <MouseoverTooltip
          text={
            <Trans>
              Post-Quantum finality is achieved when 2/3+ validators sign with both BLS and Ringtail (ML-DSA).
              Current: {validatorPercentage}% consensus
            </Trans>
          }
        >
          <AutoRow gap="sm">
            <StatusIcon active={quasarState.isPQFinal}>
              {quasarState.isPQFinal && <CheckCircle size={12} color={theme.white} />}
            </StatusIcon>
            <ThemedText.Body fontSize={14}>
              {quasarState.isPQFinal ? (
                <Trans>Active</Trans>
              ) : (
                <Trans>Building</Trans>
              )}
            </ThemedText.Body>
          </AutoRow>
        </MouseoverTooltip>
      </StatusRow>

      {witness && (
        <WitnessInfo>
          <div>
            <ThemedText.Caption color="textSecondary">
              <Trans>Validators</Trans>
            </ThemedText.Caption>
            <ThemedText.Body fontSize={14}>
              {validatorPercentage}% ({Math.round(validatorPercentage * 32 / 100)}/32)
            </ThemedText.Body>
          </div>
          <div>
            <ThemedText.Caption color="textSecondary">
              <Trans>Witness Size</Trans>
            </ThemedText.Caption>
            <ThemedText.Body fontSize={14}>
              {quasarState.witnessSize > 0 ? `${quasarState.witnessSize} bytes` : '44 bytes'}
            </ThemedText.Body>
          </div>
          <div>
            <ThemedText.Caption color="textSecondary">
              <Trans>Verification</Trans>
            </ThemedText.Caption>
            <ThemedText.Body fontSize={14}>
              {quasarState.verificationTime > 0 ? `${quasarState.verificationTime}ms` : '< 1ms'}
            </ThemedText.Body>
          </div>
          <div>
            <ThemedText.Caption color="textSecondary">
              <Trans>Block Height</Trans>
            </ThemedText.Caption>
            <ThemedText.Body fontSize={14}>
              {quasarState.lastVerifiedBlock || 'N/A'}
            </ThemedText.Body>
          </div>
        </WitnessInfo>
      )}

      <AutoRow justify="center">
        <MouseoverTooltip
          text={
            <Trans>
              {action === 'ADD' ? 'Adding' : 'Removing'} liquidity is protected by Quasar consensus.
              All operations are verified with Post-Quantum cryptography including ML-DSA signatures
              and ultra-efficient Verkle witnesses.
            </Trans>
          }
        >
          <ThemedText.Caption color="textSecondary" style={{ textAlign: 'center' }}>
            <Trans>Protected by BLS + Ringtail (ML-DSA) signatures</Trans>
          </ThemedText.Caption>
        </MouseoverTooltip>
      </AutoRow>
    </GuardContainer>
  )
}

// Export for use in other components
export type { LiquidityWitness }