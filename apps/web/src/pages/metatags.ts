import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import i18n from '@l.x/lx/src/i18n'
import { brand, getBrandUrl } from '@l.x/config'
import { MetaTagInjectorInput } from '~/shared-cloud/metatags'

function getDefaultMetatags(): MetaTagInjectorInput {
  return {
    title: i18n.t('interface.metatags.title'),
    description: i18n.t('interface.metatags.description'),
    image: getBrandUrl('/images/1200x630_Rich_Link_Preview_Image.png'),
    url: getBrandUrl(''),
  }
}

type MetatagAttributes = { property?: string; name?: string; content: string }

/**
 * Metatags are already injected server-side for SEO/crawlers. We also want
 * to dynamically update metatags as user navigates. (Safari's native share
 * function uses the page's metatag og:url as opposed to actual URL.)
 *
 * See `functions/README.md` for more info.
 */
export function useDynamicMetatags(metaTags?: MetaTagInjectorInput) {
  const resolvedMetaTags = metaTags ?? getDefaultMetatags()
  const [metaTagAttributes, setMetaTagAttributes] = useState<MetatagAttributes[]>([])
  const location = useLocation()
  // biome-ignore lint/correctness/useExhaustiveDependencies: location dependency is sufficient for this effect
  useEffect(() => {
    resolvedMetaTags.url = window.location.href
    const attributes: MetatagAttributes[] = [
      { property: 'og:title', content: resolvedMetaTags.title },
      { property: 'og:url', content: resolvedMetaTags.url },
      { property: 'twitter:title', content: resolvedMetaTags.title },
    ]
    if (resolvedMetaTags.description) {
      attributes.push(
        { property: 'og:description', content: resolvedMetaTags.description },
        { name: 'description', content: resolvedMetaTags.description },
      )
    }
    if (resolvedMetaTags.image) {
      attributes.push(
        { property: 'og:image', content: resolvedMetaTags.image },
        { property: 'og:image:alt', content: resolvedMetaTags.title },
        { property: 'twitter:image', content: resolvedMetaTags.image },
        { property: 'twitter:image:alt', content: resolvedMetaTags.title },
      )
    }
    setMetaTagAttributes(attributes)
  }, [resolvedMetaTags, location])

  return metaTagAttributes
}
