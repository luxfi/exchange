/**
 * Security Engine Service
 * Transaction risk analysis and scoring
 * Adapted from xwallet/Rabby securityEngine
 */

import {
  ApprovalInfo,
  BlacklistEntry,
  DEFAULT_SECURITY_RULES,
  RiskIndicator,
  RiskLevel,
  SecurityAssessment,
  SecurityRule,
  TransactionAnalysis,
  WhitelistEntry,
} from './types'

const STORAGE_KEY = 'lux_security_engine'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Max uint256 for unlimited approval detection
const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
const UNLIMITED_THRESHOLD = BigInt('0x' + 'f'.repeat(60)) // Very large number

class SecurityEngineService {
  private rules: Map<string, SecurityRule> = new Map()
  private blacklist: Map<string, BlacklistEntry> = new Map()
  private whitelist: Map<string, WhitelistEntry> = new Map()
  private assessmentCache: Map<string, SecurityAssessment> = new Map()
  private interactionHistory: Set<string> = new Set() // Track first interactions
  private initialized = false

  async init(): Promise<void> {
    if (this.initialized) return

    try {
      const stored = await chrome.storage.local.get(STORAGE_KEY)

      if (stored[STORAGE_KEY]) {
        const data = JSON.parse(stored[STORAGE_KEY])

        // Load rules
        if (data.rules) {
          Object.entries(data.rules).forEach(([id, rule]) => {
            this.rules.set(id, rule as SecurityRule)
          })
        }

        // Load blacklist
        if (data.blacklist) {
          Object.entries(data.blacklist).forEach(([address, entry]) => {
            this.blacklist.set(address.toLowerCase(), entry as BlacklistEntry)
          })
        }

        // Load whitelist
        if (data.whitelist) {
          Object.entries(data.whitelist).forEach(([address, entry]) => {
            this.whitelist.set(address.toLowerCase(), entry as WhitelistEntry)
          })
        }

        // Load interaction history
        if (data.interactionHistory) {
          this.interactionHistory = new Set(data.interactionHistory)
        }
      }

      // Initialize default rules if not present
      if (this.rules.size === 0) {
        DEFAULT_SECURITY_RULES.forEach((rule) => {
          this.rules.set(rule.id, rule)
        })
        await this.persist()
      }

      this.initialized = true
    } catch (error) {
      console.error('Failed to load security engine:', error)
      // Initialize with defaults
      DEFAULT_SECURITY_RULES.forEach((rule) => {
        this.rules.set(rule.id, rule)
      })
      this.initialized = true
    }
  }

  private async persist(): Promise<void> {
    const rulesObj: Record<string, SecurityRule> = {}
    this.rules.forEach((rule, id) => {
      rulesObj[id] = rule
    })

    const blacklistObj: Record<string, BlacklistEntry> = {}
    this.blacklist.forEach((entry, address) => {
      blacklistObj[address] = entry
    })

    const whitelistObj: Record<string, WhitelistEntry> = {}
    this.whitelist.forEach((entry, address) => {
      whitelistObj[address] = entry
    })

    await chrome.storage.local.set({
      [STORAGE_KEY]: JSON.stringify({
        rules: rulesObj,
        blacklist: blacklistObj,
        whitelist: whitelistObj,
        interactionHistory: Array.from(this.interactionHistory),
      }),
    })
  }

  async assessTransaction(analysis: TransactionAnalysis): Promise<SecurityAssessment> {
    await this.init()

    const cacheKey = this.getCacheKey(analysis)
    const cached = this.assessmentCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached
    }

    const indicators: RiskIndicator[] = []
    const toAddress = analysis.to?.toLowerCase()

    // Check blacklist
    const isBlacklisted = toAddress ? this.blacklist.has(toAddress) : false
    if (isBlacklisted) {
      const entry = this.blacklist.get(toAddress!)
      indicators.push({
        ruleId: 'blacklisted',
        ruleName: 'Blacklisted Address',
        level: RiskLevel.Critical,
        message: `This address has been flagged: ${entry?.reason || 'Unknown reason'}`,
      })
    }

    // Check whitelist
    const isWhitelisted = toAddress ? this.whitelist.has(toAddress) : false

    // Run enabled rules
    for (const [ruleId, rule] of this.rules) {
      if (!rule.enabled) continue

      const indicator = await this.evaluateRule(rule, analysis)
      if (indicator) {
        indicators.push(indicator)
      }
    }

    // Calculate overall risk level
    const overallLevel = this.calculateOverallLevel(indicators, isWhitelisted)

    const assessment: SecurityAssessment = {
      overallLevel,
      indicators,
      isBlacklisted,
      isWhitelisted,
      timestamp: Date.now(),
    }

    // Cache the assessment
    this.assessmentCache.set(cacheKey, assessment)

    // Record interaction for first-time detection
    if (toAddress) {
      const interactionKey = `${analysis.chainId}:${toAddress}`
      if (!this.interactionHistory.has(interactionKey)) {
        this.interactionHistory.add(interactionKey)
        await this.persist()
      }
    }

    return assessment
  }

  private async evaluateRule(
    rule: SecurityRule,
    analysis: TransactionAnalysis
  ): Promise<RiskIndicator | null> {
    const toAddress = analysis.to?.toLowerCase()

    switch (rule.id) {
      case 'unlimited_approval':
        return this.checkUnlimitedApproval(rule, analysis.approvals)

      case 'first_interaction':
        if (toAddress) {
          const interactionKey = `${analysis.chainId}:${toAddress}`
          if (!this.interactionHistory.has(interactionKey)) {
            return {
              ruleId: rule.id,
              ruleName: rule.name,
              level: rule.level,
              message: 'This is your first time interacting with this contract',
            }
          }
        }
        return null

      case 'large_value_transfer':
        return this.checkLargeValueTransfer(rule, analysis.value)

      case 'eth_sign_request':
        // This would be checked separately for signing requests
        return null

      case 'suspicious_data':
        return this.checkSuspiciousData(rule, analysis.data)

      default:
        return null
    }
  }

  private checkUnlimitedApproval(
    rule: SecurityRule,
    approvals?: ApprovalInfo[]
  ): RiskIndicator | null {
    if (!approvals || approvals.length === 0) return null

    for (const approval of approvals) {
      if (approval.isUnlimited) {
        return {
          ruleId: rule.id,
          ruleName: rule.name,
          level: rule.level,
          message: `Unlimited approval requested for ${approval.symbol || approval.token}`,
          details: { spender: approval.spender, token: approval.token },
        }
      }

      // Check if amount is effectively unlimited
      try {
        const amount = BigInt(approval.amount)
        if (amount >= UNLIMITED_THRESHOLD) {
          return {
            ruleId: rule.id,
            ruleName: rule.name,
            level: rule.level,
            message: `Very large approval amount for ${approval.symbol || approval.token}`,
            details: { spender: approval.spender, token: approval.token, amount: approval.amount },
          }
        }
      } catch {
        // Invalid amount format, skip
      }
    }

    return null
  }

  private checkLargeValueTransfer(rule: SecurityRule, value: string): RiskIndicator | null {
    try {
      const valueWei = BigInt(value)
      // Flag transfers over 10 ETH as large (configurable in future)
      const threshold = BigInt('10000000000000000000') // 10 ETH in wei

      if (valueWei > threshold) {
        return {
          ruleId: rule.id,
          ruleName: rule.name,
          level: rule.level,
          message: 'This is a large value transfer',
          details: { value },
        }
      }
    } catch {
      // Invalid value format
    }

    return null
  }

  private checkSuspiciousData(rule: SecurityRule, data: string): RiskIndicator | null {
    if (!data || data === '0x') return null

    // Known suspicious patterns (simplified)
    const suspiciousPatterns = [
      '0x23b872dd', // transferFrom without approval context
      '0x42842e0e', // safeTransferFrom without approval context
    ]

    const methodId = data.slice(0, 10).toLowerCase()

    // This is a simplified check - in production, we'd have more sophisticated analysis
    // For now, just flag known risky methods
    if (suspiciousPatterns.includes(methodId)) {
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        level: RiskLevel.Medium, // Downgrade from rule level as this is just a hint
        message: 'Transaction uses a method that could transfer your assets',
        details: { methodId },
      }
    }

    return null
  }

  private calculateOverallLevel(
    indicators: RiskIndicator[],
    isWhitelisted: boolean
  ): RiskLevel {
    if (indicators.length === 0) {
      return RiskLevel.Safe
    }

    // Get the highest risk level
    const levelPriority: Record<RiskLevel, number> = {
      [RiskLevel.Safe]: 0,
      [RiskLevel.Low]: 1,
      [RiskLevel.Medium]: 2,
      [RiskLevel.High]: 3,
      [RiskLevel.Critical]: 4,
    }

    let maxPriority = 0
    for (const indicator of indicators) {
      const priority = levelPriority[indicator.level]
      if (priority > maxPriority) {
        maxPriority = priority
      }
    }

    // If whitelisted, cap at Medium unless Critical
    if (isWhitelisted && maxPriority < levelPriority[RiskLevel.Critical]) {
      maxPriority = Math.min(maxPriority, levelPriority[RiskLevel.Medium])
    }

    // Convert back to RiskLevel
    for (const [level, priority] of Object.entries(levelPriority)) {
      if (priority === maxPriority) {
        return level as RiskLevel
      }
    }

    return RiskLevel.Safe
  }

  private getCacheKey(analysis: TransactionAnalysis): string {
    return `${analysis.chainId}:${analysis.to}:${analysis.data}:${analysis.value}`
  }

  // Rule management
  async setRuleEnabled(ruleId: string, enabled: boolean): Promise<boolean> {
    await this.init()

    const rule = this.rules.get(ruleId)
    if (!rule) return false

    rule.enabled = enabled
    this.rules.set(ruleId, rule)
    await this.persist()
    return true
  }

  async getRules(): Promise<SecurityRule[]> {
    await this.init()
    return Array.from(this.rules.values())
  }

  // Blacklist management
  async addToBlacklist(address: string, reason: string, source = 'user'): Promise<void> {
    await this.init()

    const entry: BlacklistEntry = {
      address: address.toLowerCase(),
      reason,
      addedAt: Date.now(),
      source,
    }

    this.blacklist.set(address.toLowerCase(), entry)
    await this.persist()
  }

  async removeFromBlacklist(address: string): Promise<boolean> {
    await this.init()

    const removed = this.blacklist.delete(address.toLowerCase())
    if (removed) {
      await this.persist()
    }
    return removed
  }

  async isBlacklisted(address: string): Promise<boolean> {
    await this.init()
    return this.blacklist.has(address.toLowerCase())
  }

  // Whitelist management
  async addToWhitelist(address: string, name?: string): Promise<void> {
    await this.init()

    const entry: WhitelistEntry = {
      address: address.toLowerCase(),
      name,
      addedAt: Date.now(),
    }

    this.whitelist.set(address.toLowerCase(), entry)
    await this.persist()
  }

  async removeFromWhitelist(address: string): Promise<boolean> {
    await this.init()

    const removed = this.whitelist.delete(address.toLowerCase())
    if (removed) {
      await this.persist()
    }
    return removed
  }

  async isWhitelisted(address: string): Promise<boolean> {
    await this.init()
    return this.whitelist.has(address.toLowerCase())
  }

  // Cache management
  clearCache(): void {
    this.assessmentCache.clear()
  }
}

export const securityEngine = new SecurityEngineService()
