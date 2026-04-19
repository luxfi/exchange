import i18n from '@l.x/lx/src/i18n'
import { v4 as uuid } from 'uuid'

// You may throw an instance of this class when the user rejects a request in their wallet.
// The benefit is that you can distinguish this error from other errors using didUserReject().
export class UserRejectedRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserRejectedRequestError'
  }
}

export function toReadableError(errorText: string, error: unknown) {
  if (typeof error === 'object' && error !== null) {
    const e = error as Error & { reason?: string }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return new Error(`${errorText} 👺 ${e.message ?? e.reason ?? 'unknown'}`)
  }
  return new Error(`${errorText} 👺 ${error}`)
}

export class WrongChainError extends Error {
  constructor() {
    super(i18n.t('wallet.wrongNet'))
  }
}

export class DEXv2HardQuoteError extends Error {
  constructor() {
    super(i18n.t('dex.v2QuoteFailed'))
    this.name = 'DEXv2HardQuoteError'
  }
}

export class SignatureExpiredError extends Error {
  private _id: string
  constructor() {
    super(i18n.t('common.signatureExpired'))
    this.name = 'SignatureExpiredError'
    this._id = `SignatureExpiredError-${uuid()}`
  }

  get id(): string {
    return this._id
  }
}
