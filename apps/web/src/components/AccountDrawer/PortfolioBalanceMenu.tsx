import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { PortfolioBalanceSettingsContent } from '@l.x/lx/src/features/settings/balances/PortfolioBalanceSettingsContent'
=======
import { PortfolioBalanceSettingsContent } from 'uniswap/src/features/settings/balances/PortfolioBalanceSettingsContent'
>>>>>>> upstream/main
import { SlideOutMenu } from '~/components/AccountDrawer/SlideOutMenu'

export default function PortfolioBalanceMenu({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()

  return (
    <SlideOutMenu title={t('settings.setting.balancesActivity.title')} onClose={onClose}>
      <PortfolioBalanceSettingsContent />
    </SlideOutMenu>
  )
}
