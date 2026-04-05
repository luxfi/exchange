import {
  ChainToken,
  ChainTokenStats,
  MultichainToken,
  SafetyLevel,
  SpamCode,
  TimestampedValue,
  TokenStats,
  TokenType,
} from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { TokenStat } from '~/state/explore/types'
import { getChainIdFromChainUrlParam } from '~/utils/chainParams'

const STANDARD_TO_TOKEN_TYPE: Partial<Record<string, TokenType>> = {
  UNKNOWN: TokenType.UNKNOWN,
  NATIVE: TokenType.NATIVE,
  ERC20: TokenType.ERC20,
  ERC721: TokenType.ERC721,
  ERC1155: TokenType.ERC1155,
  SPL: TokenType.SPL,
}

function tokenTypeFromStat(stat: TokenStat): TokenType | undefined {
  const standard = stat.standard?.toUpperCase()
  return standard ? STANDARD_TO_TOKEN_TYPE[standard] : undefined
}

/** Valid SafetyLevel enum values (numeric); protobuf enum is number-based. */
const VALID_SAFETY_LEVELS = new Set(Object.values(SafetyLevel).filter((v): v is number => typeof v === 'number'))

function toSafetyLevel(value: unknown): SafetyLevel {
  const num = Number(value)
  if (!Number.isFinite(num) || !Number.isInteger(num) || !VALID_SAFETY_LEVELS.has(num)) {
    return SafetyLevel.UNKNOWN
  }
  return num as SafetyLevel
}

/**
 * Converts legacy Explore TokenStat[] to MultichainToken[] so the legacy path
 * can produce the same canonical shape as the backend paths.
 *
 * Each TokenStat is a single-chain token, so each becomes one MultichainToken
 * with exactly one ChainToken. Token type is derived from stat.standard when
 * present; otherwise type is TokenType.UNKNOWN.
 *
 * @param tokenStats - Legacy explore token stats, or undefined/empty for no tokens.
 * @returns MultichainToken[] in the same shape as backend list-tokens responses.
 */
export function tokenStatsToMultichainTokens(tokenStats: TokenStat[] | undefined): MultichainToken[] {
  if (!tokenStats?.length) {
    return []
  }
  return tokenStats.map((stat) => tokenStatToMultichainToken(stat))
}

function tokenStatToMultichainToken(stat: TokenStat): MultichainToken {
  const chainId = getChainIdFromChainUrlParam(stat.chain.toLowerCase()) ?? 1
  const multichainId = `mc:${chainId}_${stat.address}`

  const chainTokenStats =
    stat.volume?.value !== undefined
      ? new ChainTokenStats({
          volume1d: stat.volume.value,
        })
      : undefined

  const chainToken = new ChainToken({
    chainId,
    address: stat.address,
    decimals: stat.decimals ?? 18,
    isBridged: false,
    stats: chainTokenStats,
  })

  const safetyLevel = stat.project?.safetyLevel ? toSafetyLevel(stat.project.safetyLevel) : SafetyLevel.UNKNOWN
  const spamCode = stat.project?.isSpam ? SpamCode.SPAM : SpamCode.NOT_SPAM

  const stats = new TokenStats({
    price: stat.price?.value,
    fdv: stat.fullyDilutedValuation?.value,
    priceChange1h: stat.pricePercentChange1Hour?.value,
    priceChange1d: stat.pricePercentChange1Day?.value,
    volume1d: stat.volume?.value,
    priceHistory1d: stat.priceHistory?.map(
      (p) => new TimestampedValue({ timestamp: BigInt(p.timestamp), value: p.value }),
    ),
  })

  return new MultichainToken({
    multichainId,
    symbol: stat.symbol,
    name: stat.name,
    type: tokenTypeFromStat(stat) ?? TokenType.UNKNOWN,
    projectName: stat.project?.name ?? '',
    logoUrl: stat.logo ?? '',
    safetyLevel,
    spamCode,
    stats,
    chainTokens: [chainToken],
  })
}
