// Regulated-asset disclosure box shown above the swap CTA when the
// selected pair includes a security token.
//
// Upstream-neutral: copy is driven entirely by runtime config
// (`securityDisclosure.title|body|bullets`). If no config is supplied,
// renders generic fallback text — the defaults are deliberately
// jurisdiction-agnostic ("verified identity", "transfer restrictions")
// so the component is safe to render on any tenant that opts into the
// gate.
//
// Security: all config strings render as React children — the default
// text-escaping prevents HTML/JS injection even if /config.json is
// compromised. Never use dangerouslySetInnerHTML here.

import { Flex, styled, Text } from '@l.x/ui/src'
import type { SecurityDisclosureConfig } from '@l.x/config'

const DisclaimerText = styled(Text, {
  variant: 'body4',
  color: '$neutral2',
})

const BulletRow = styled(Flex, {
  row: true,
  alignItems: 'flex-start',
  gap: '$spacing8',
})

const DEFAULT_TITLE = 'Digital security'
const DEFAULT_BODY =
  'This token represents a security regulated under applicable law. Trading requires verified identity.'
const DEFAULT_BULLETS: readonly string[] = [
  'Regulated security',
  'Transfer restrictions apply',
  'Verified investors only',
]

export function SecurityDisclosure({
  disclosure,
  testID,
}: {
  disclosure?: SecurityDisclosureConfig
  testID?: string
}): JSX.Element {
  const title = disclosure?.title || DEFAULT_TITLE
  const body = disclosure?.body || DEFAULT_BODY
  const bullets = disclosure?.bullets && disclosure.bullets.length > 0 ? disclosure.bullets : DEFAULT_BULLETS

  return (
    <Flex
      backgroundColor="$surface2"
      borderColor="$surface3"
      borderWidth="$spacing1"
      borderRadius="$rounded16"
      p="$spacing12"
      gap="$spacing8"
      testID={testID}
      role="note"
      aria-label={title}
    >
      <Text variant="body3" color="$neutral1" fontWeight="600">
        {title}
      </Text>
      <DisclaimerText>{body}</DisclaimerText>
      {bullets.length > 0 ? (
        <Flex gap="$spacing4" mt="$spacing4">
          {bullets.map((b, i) => (
            <BulletRow key={`${i}-${b}`}>
              <Text variant="body4" color="$neutral3" aria-hidden="true">
                ·
              </Text>
              <DisclaimerText>{b}</DisclaimerText>
            </BulletRow>
          ))}
        </Flex>
      ) : null}
    </Flex>
  )
}
