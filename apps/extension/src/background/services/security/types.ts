/**
 * Security Engine Types
 * Transaction risk analysis and scoring
 * Adapted from xwallet/Rabby securityEngine
 */

export enum RiskLevel {
  Safe = 'safe',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

export interface SecurityRule {
  id: string
  name: string
  description: string
  level: RiskLevel
  enabled: boolean
}

export interface RiskIndicator {
  ruleId: string
  ruleName: string
  level: RiskLevel
  message: string
  details?: Record<string, unknown>
}

export interface SecurityAssessment {
  overallLevel: RiskLevel
  indicators: RiskIndicator[]
  isBlacklisted: boolean
  isWhitelisted: boolean
  contractVerified?: boolean
  timestamp: number
}

export interface ContractInfo {
  address: string
  chainId: number
  isVerified: boolean
  name?: string
  isProxy?: boolean
  implementationAddress?: string
}

export interface TransactionAnalysis {
  to: string
  from: string
  value: string
  data: string
  chainId: number
  // Decoded info
  methodName?: string
  methodId?: string
  decodedParams?: Record<string, unknown>
  // Token transfer info
  tokenTransfers?: TokenTransfer[]
  // Approval info
  approvals?: ApprovalInfo[]
}

export interface TokenTransfer {
  token: string
  from: string
  to: string
  amount: string
  symbol?: string
  decimals?: number
}

export interface ApprovalInfo {
  token: string
  spender: string
  amount: string
  isUnlimited: boolean
  symbol?: string
}

// Known malicious addresses/contracts (maintained list)
export interface BlacklistEntry {
  address: string
  reason: string
  addedAt: number
  source: string
}

// User whitelist for trusted addresses
export interface WhitelistEntry {
  address: string
  name?: string
  addedAt: number
}

// Security engine state
export interface SecurityEngineState {
  rules: Record<string, SecurityRule>
  blacklist: Record<string, BlacklistEntry>
  whitelist: Record<string, WhitelistEntry>
  assessmentCache: Record<string, SecurityAssessment>
}

// Default security rules
export const DEFAULT_SECURITY_RULES: SecurityRule[] = [
  {
    id: 'new_contract',
    name: 'New Contract',
    description: 'Contract deployed recently (less than 7 days)',
    level: RiskLevel.Medium,
    enabled: true,
  },
  {
    id: 'unverified_contract',
    name: 'Unverified Contract',
    description: 'Contract source code not verified',
    level: RiskLevel.Medium,
    enabled: true,
  },
  {
    id: 'unlimited_approval',
    name: 'Unlimited Approval',
    description: 'Transaction requests unlimited token approval',
    level: RiskLevel.High,
    enabled: true,
  },
  {
    id: 'first_interaction',
    name: 'First Interaction',
    description: 'First time interacting with this contract',
    level: RiskLevel.Low,
    enabled: true,
  },
  {
    id: 'suspicious_recipient',
    name: 'Suspicious Recipient',
    description: 'Recipient has been flagged in security databases',
    level: RiskLevel.Critical,
    enabled: true,
  },
  {
    id: 'large_value_transfer',
    name: 'Large Value Transfer',
    description: 'Transaction value exceeds your typical transfer amount',
    level: RiskLevel.Medium,
    enabled: true,
  },
  {
    id: 'eth_sign_request',
    name: 'Raw Message Signing',
    description: 'Application requesting dangerous eth_sign method',
    level: RiskLevel.Critical,
    enabled: true,
  },
  {
    id: 'suspicious_data',
    name: 'Suspicious Transaction Data',
    description: 'Transaction data pattern matches known exploit',
    level: RiskLevel.High,
    enabled: true,
  },
]
