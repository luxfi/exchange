import { Flex, styled, Text } from '@l.x/ui/src'

const Container = styled(Flex, {
  width: '100%',
  maxWidth: 1360,
  alignItems: 'center',
  px: 40,
  $lg: { px: 48 },
  $sm: { px: 24 },
})

const Card = styled(Flex, {
  width: '100%',
  maxWidth: 1280,
  borderRadius: '$rounded24',
  backgroundColor: '$surface2',
  borderColor: '$surface3',
  borderWidth: 1,
  py: '$spacing24',
  px: '$spacing32',
  gap: '$spacing12',
  $sm: { px: '$spacing20', py: '$spacing20' },
})

// Static, non-animated statement. The $113T figure references global asset liquidity now
// reachable on-chain through Liquidity.io (regulated ATS routing).
export function LiquidityBanner() {
  return (
    <Container>
      <Card row $md={{ flexDirection: 'column', alignItems: 'flex-start', gap: '$spacing16' }} alignItems="center" justifyContent="space-between">
        <Flex gap="$spacing4" flex={1}>
          <Text variant="heading3" $md={{ variant: 'subheading1' }}>$113T in regulated asset liquidity</Text>
          <Text variant="body2" color="$neutral2">
            Trade against $113 trillion in global regulated asset liquidity, settled on-chain through Liquidity.io.
          </Text>
        </Flex>
        <a
          href="https://liquidity.io"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <Flex
            backgroundColor="$accent1"
            borderRadius="$rounded24"
            px="$spacing20"
            py="$spacing12"
            hoverStyle={{ opacity: 0.9 }}
          >
            <Text variant="buttonLabel2" color="$white">Learn more</Text>
          </Flex>
        </a>
      </Card>
    </Container>
  )
}
