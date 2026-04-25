import { hasURL } from '~/utils/urlChecks'

test('hasURL', () => {
  expect(hasURL('this is my personal website: https://www.example.com')).toBe(true)
  expect(hasURL('#corngang')).toBe(false)
  expect(hasURL('Unislap-LP.org')).toBe(true)
  expect(hasURL('https://lux.network')).toBe(true)
  expect(hasURL('https://www.lux.network')).toBe(true)
  expect(hasURL('http://lux.network')).toBe(true)
  expect(hasURL('http://username:password@lux.network')).toBe(true)
  expect(hasURL('http://app.lux.network')).toBe(true)
  expect(hasURL('username:password@app.lux.network:22')).toBe(true)
  expect(hasURL('lux.network:80')).toBe(true)
  expect(hasURL('asdf lux.network:80 asdf')).toBe(true)
})
