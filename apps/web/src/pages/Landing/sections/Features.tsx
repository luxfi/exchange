import { useInView } from 'pages/Landing/sections/useInView'
import { useTranslation } from 'react-i18next'
import { Flex, styled, Text } from 'ui/src'

const Container = styled(Flex, {
  width: '100%',
  maxWidth: 1360,
  alignItems: 'center',
  p: 40,

  $lg: {
    p: 48,
  },

  $sm: {
    p: 24,
  },
})

const SectionLayout = styled(Flex, {
  width: '100%',
  maxWidth: 1280,
})

const FeatureGrid = styled(Flex, {
  width: '100%',
  '$platform-web': {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  $lg: {
    '$platform-web': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  $sm: {
    '$platform-web': {
      gridTemplateColumns: '1fr',
    },
  },
})

const FeatureCard = styled(Flex, {
  backgroundColor: '$surface2',
  borderRadius: '$rounded20',
  p: '$spacing24',
  gap: '$spacing16',
  flexDirection: 'column',
  minHeight: 200,
  
  hoverStyle: {
    backgroundColor: '$surface3',
  },
})

const IconWrapper = styled(Flex, {
  width: 48,
  height: 48,
  borderRadius: '$rounded12',
  backgroundColor: '$accent2',
  alignItems: 'center',
  justifyContent: 'center',
})

// Feature icons as simple SVG components
function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 11.99H18C17.47 15.11 15.07 17.92 12 18.93V12H6V6.3L12 4.19V11.99Z" fill="currentColor"/>
    </svg>
  )
}

function QuantumIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="2"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="2" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="2" transform="rotate(120 12 12)"/>
    </svg>
  )
}

function LiquidityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
    </svg>
  )
}

function OmnichainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <circle cx="4" cy="12" r="2" fill="currentColor"/>
      <circle cx="20" cy="12" r="2" fill="currentColor"/>
      <circle cx="12" cy="4" r="2" fill="currentColor"/>
      <circle cx="12" cy="20" r="2" fill="currentColor"/>
      <path d="M6 12H10M14 12H18M12 6V10M12 14V18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  )
}

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  inView: boolean
}

function FeatureItem({ icon, title, description, delay, inView }: FeatureItemProps) {
  return (
    <FeatureCard
      opacity={inView ? 1 : 0}
      y={inView ? 0 : 20}
      animation="quick"
      style={{ 
        transitionDelay: `${delay}s`,
        transition: 'opacity 0.6s ease, transform 0.6s ease'
      }}
    >
      <IconWrapper>
        <Text color="$accent1">{icon}</Text>
      </IconWrapper>
      <Flex gap="$spacing8">
        <Text variant="subheading1" fontWeight="$medium">
          {title}
        </Text>
        <Text variant="body2" color="$neutral2">
          {description}
        </Text>
      </Flex>
    </FeatureCard>
  )
}

export function Features() {
  const { t } = useTranslation()
  const { ref, inView } = useInView()

  const features = [
    {
      icon: <ShieldIcon />,
      title: t('features.privacy.title'),
      description: t('features.privacy.description'),
    },
    {
      icon: <QuantumIcon />,
      title: t('features.quantum.title'),
      description: t('features.quantum.description'),
    },
    {
      icon: <LiquidityIcon />,
      title: t('features.liquidity.title'),
      description: t('features.liquidity.description'),
    },
    {
      icon: <OmnichainIcon />,
      title: t('features.omnichain.title'),
      description: t('features.omnichain.description'),
    },
  ]

  return (
    <Container>
      <SectionLayout ref={ref}>
        <Flex gap="$spacing48" flexDirection="column">
          <Flex gap="$spacing16" flexDirection="column" alignItems="center">
            <Text variant="heading2" $md={{ variant: 'heading3' }}>
              {t('features.heading')}
            </Text>
            <Text variant="body1" color="$neutral2" maxWidth={600}>
              {t('features.subheading')}
            </Text>
          </Flex>
          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureItem
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
                inView={inView}
              />
            ))}
          </FeatureGrid>
        </Flex>
      </SectionLayout>
    </Container>
  )
}
