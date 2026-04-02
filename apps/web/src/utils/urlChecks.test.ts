import { hasURL } from '~/utils/urlChecks'

test('hasURL', () => {
  expect(hasURL('this is my personal website: https://www.example.com')).toBe(true)
  expect(hasURL('#corngang')).toBe(false)
  expect(hasURL('Unislap-LP.org')).toBe(true)
  expect(hasURL('https://lux.org')).toBe(true)
  expect(hasURL('https://www.lux.org')).toBe(true)
  expect(hasURL('http://lux.org')).toBe(true)
  expect(hasURL('http://username:password@lux.org')).toBe(true)
  expect(hasURL('http://app.lux.org')).toBe(true)
  expect(hasURL('username:password@app.lux.org:22')).toBe(true)
  expect(hasURL('lux.org:80')).toBe(true)
  expect(hasURL('asdf lux.org:80 asdf')).toBe(true)
})
