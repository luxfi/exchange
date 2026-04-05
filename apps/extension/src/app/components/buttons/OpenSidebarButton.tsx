import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Button, Flex } from '@l.x/ui/src'
import { ArrowRight } from '@l.x/ui/src/components/icons/ArrowRight'
=======
import { Button, Flex } from 'ui/src'
import { ArrowRight } from 'ui/src/components/icons/ArrowRight'
>>>>>>> upstream/main

export function OpenSidebarButton({
  openedSideBar,
  handleOpenSidebar,
  handleOpenWebApp,
}: {
  openedSideBar: boolean
  handleOpenSidebar: () => Promise<void>
  handleOpenWebApp: () => Promise<void>
}) {
  const { t } = useTranslation()
  return (
    <Flex row alignSelf="stretch">
      <Button
        icon={openedSideBar ? <ArrowRight /> : undefined}
        iconPosition="after"
        size="large"
        variant={openedSideBar ? 'branded' : 'default'}
        emphasis={openedSideBar ? 'primary' : 'secondary'}
        onPress={openedSideBar ? handleOpenWebApp : handleOpenSidebar}
      >
<<<<<<< HEAD
        {openedSideBar ? t('onboarding.complete.go_to_lux') : t('onboarding.complete.button')}
=======
        {openedSideBar ? t('onboarding.complete.go_to_uniswap') : t('onboarding.complete.button')}
>>>>>>> upstream/main
      </Button>
    </Flex>
  )
}
