const defaultUrls = ['http://localhost:3000/', 'http://localhost:3000/swap', 'http://localhost:3000/pool']

test.each(defaultUrls)('should inject metadata for valid collections', async (defaultUrl) => {
  const body = await fetch(new Request(defaultUrl)).then((res) => res.text())
  expect(body).toContain(`<meta property="og:title" content="Lux Exchange"`)
  expect(body).toContain(
    `<meta property="og:description" content="Swap and trade crypto on Lux, Ethereum, Arbitrum, Base, Polygon and more. Decentralized exchange powered by Lux Network."`,
  )
  expect(body).toContain(
    `<meta name="description" content="Swap and trade crypto on Lux, Ethereum, Arbitrum, Base, Polygon and more. Decentralized exchange powered by Lux Network."`,
  )
  expect(body).toContain(
    `<meta property="og:image" content="http://localhost:3000/images/1200x630_Rich_Link_Preview_Image.png"`,
  )
  expect(body).toContain(`<meta property="og:image:width" content="1200"`)
  expect(body).toContain(`<meta property="og:image:height" content="630"`)
  expect(body).toContain(`<meta property="og:type" content="website"`)
  expect(body).toContain(`<meta property="og:image:alt" content="Lux Exchange"`)
  expect(body).toContain(`<meta property="twitter:card" content="summary_large_image"`)
  expect(body).toContain(`<meta property="twitter:title" content="Lux Exchange"`)
  expect(body).toContain(
    `<meta property="twitter:image" content="http://localhost:3000/images/1200x630_Rich_Link_Preview_Image.png"`,
  )
  expect(body).toContain(`<meta property="twitter:image:alt" content="Lux Exchange"`)
})
