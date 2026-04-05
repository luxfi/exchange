import { logger } from 'utilities/src/logger/logger'

// Privy REST API for encrypted authorization keys
// Docs: https://docs.privy.io/guide/api/encrypted-authorization-keys
const PRIVY_API_BASE = 'https://auth.privy.io/api/v1/encrypted_authorization_keys'

function privyHeaders(accessToken: string, privyAppId: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'privy-app-id': privyAppId,
  }
}

export async function storeEncryptedBlob({
  accessToken,
  blob,
  privyAppId,
}: {
  accessToken: string
  blob: string
  privyAppId: string
}): Promise<{ keyId: string }> {
  const response = await fetch(PRIVY_API_BASE, {
    method: 'POST',
    headers: privyHeaders(accessToken, privyAppId),
    body: JSON.stringify({ ciphertext: blob }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => 'unknown error')
    logger.error(new Error(`Failed to store encrypted blob at Privy: ${response.status} ${text}`), {
      tags: { file: 'privyBlobStore.ts', function: 'storeEncryptedBlob' },
    })
    throw new Error('Failed to store recovery data')
  }

  const data = (await response.json()) as { id: string }
  return { keyId: data.id }
}

export async function fetchEncryptedBlob({
  accessToken,
  keyId,
  privyAppId,
}: {
  accessToken: string
  keyId: string
  privyAppId: string
}): Promise<string> {
  const response = await fetch(`${PRIVY_API_BASE}/${keyId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'privy-app-id': privyAppId,
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => 'unknown error')
    logger.error(new Error(`Failed to fetch encrypted blob from Privy: ${response.status} ${text}`), {
      tags: { file: 'privyBlobStore.ts', function: 'fetchEncryptedBlob' },
    })
    throw new Error('Failed to fetch recovery data')
  }

  const data = (await response.json()) as { ciphertext: string }
  return data.ciphertext
}
