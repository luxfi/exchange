import { renderPoolOgImage } from 'functions/api/image/pools'
import getPosition from 'functions/utils/getPosition'
import { getRequest } from 'functions/utils/getRequest'
import { type Context } from 'hono'

export async function positionImageHandler(c: Context) {
  try {
    const { version, chainName, identifier } = c.req.param()
    const origin = new URL(c.req.url).origin

    const cacheUrl = `${origin}/positions/${version}/${chainName}/${identifier}`
    const data = await getRequest({
      url: cacheUrl,
      getData: () =>
        getPosition({
          version: version as 'v2' | 'v3' | 'v4',
          chainName,
          identifier,
          url: cacheUrl,
        }),
      validateData: (data): data is NonNullable<Awaited<ReturnType<typeof getPosition>>> => Boolean(data.title),
    })

    if (!data) {
      return new Response('Position not found.', { status: 404 })
    }

    return renderPoolOgImage({
      data,
      networkName: chainName,
      c,
      versionBadge: data.poolData?.protocolVersion,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return new Response(message, { status: 500 })
  }
}
