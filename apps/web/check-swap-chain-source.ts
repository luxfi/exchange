import { chromium } from '@playwright/test'

const browser = await chromium.launch()
const page = await browser.newPage()

console.log('\n=== FINAL VERIFICATION ===\n')

await page.goto('http://localhost:3000/swap?chain=lux-dev&chainId=1337', {
  waitUntil: 'networkidle',
})

await page.waitForTimeout(2000)

// Get the chain info from URL
const url = new URL(page.url())
const chainParam = url.searchParams.get('chain')
const chainIdParam = url.searchParams.get('chainId')

console.log('URL Parameters:')
console.log('  chain:', chainParam)
console.log('  chainId:', chainIdParam)

// Get what AppKit thinks
const appkitNetwork = await page.evaluate(() => {
  return localStorage.getItem('@appkit/active_caip_network_id')
})

console.log('\nAppKit Active Network (localStorage):')
console.log('  Value:', appkitNetwork)

if (appkitNetwork) {
  const [namespace, reference] = appkitNetwork.split(':')
  const chainMap: Record<string, string> = {
    '96369': 'C-Chain Mainnet',
    '96368': 'C-Chain Testnet', 
    '1337': 'Lux Dev',
    '200200': 'Zoo Mainnet',
    '200201': 'Zoo Testnet',
  }
  console.log('  Mapped Chain:', chainMap[reference] || reference)
}

// Get page content
const pageText = await page.textContent('body')

console.log('\nChain References in Page Text:')
const matches = pageText?.match(/(Mainnet|Testnet|Devnet|C-Chain|Zoo|Hanzo|Lux Dev|lux-dev|1337|96369)/gi) || []
const unique = [...new Set(matches)]
console.log('  Found:', unique.slice(0, 15).join(', '))

console.log('\n=== DIAGNOSIS ===')
console.log('URL says: lux-dev (1337) should be selected')
console.log('AppKit says:', appkitNetwork?.includes('96369') ? 'C-Chain Mainnet (96369)' : appkitNetwork)

if (chainIdParam === '1337' && appkitNetwork?.includes('96369')) {
  console.log('\nCONFLICT CONFIRMED:')
  console.log('  - URL parameter expects Lux Dev (1337)')
  console.log('  - But AppKit has C-Chain Mainnet (96369) in localStorage')
  console.log('  - Token selector likely uses AppKit value instead of URL param')
  console.log('  - This explains why no tokens appear (wrong chain data)')
}

await browser.close()
