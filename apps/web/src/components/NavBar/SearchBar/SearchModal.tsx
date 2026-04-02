import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, type Input, Text, TouchableArea, useMedia, useScrollbarStyles, useSporeColors } from '@luxfi/ui/src'
import { Modal } from '@l.x/lx/src/components/modals/Modal'
import { useUpdateScrollLock } from '@l.x/lx/src/components/modals/ScrollLock'
import { NetworkFilter } from '@l.x/lx/src/components/network/NetworkFilter'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { useFilterCallbacks } from '@l.x/lx/src/features/search/SearchModal/hooks/useFilterCallbacks'
import { SearchModalNoQueryList } from '@l.x/lx/src/features/search/SearchModal/SearchModalNoQueryList'
import { SearchModalResultsList } from '@l.x/lx/src/features/search/SearchModal/SearchModalResultsList'
import { SearchTab, WEB_SEARCH_TABS } from '@l.x/lx/src/features/search/SearchModal/types'
import { SearchTextInput } from '@l.x/lx/src/features/search/SearchTextInput'
import { ElementName, InterfaceEventName, ModalName, SectionName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { Trace } from '@l.x/lx/src/features/telemetry/Trace'
import { useTrace } from '@luxfi/utilities/src/telemetry/trace/TraceContext'
import { useDebounce } from '@luxfi/utilities/src/time/timing'
import { useModalState } from '~/hooks/useModalState'

export const SearchModal = memo(function _SearchModal(): JSX.Element {
  const colors = useSporeColors()
  const { t } = useTranslation()
  const media = useMedia()
  const scrollbarStyles = useScrollbarStyles()

  const { isOpen: isModalOpen, toggleModal: toggleSearchModal } = useModalState(ModalName.Search)

  // Use ref for programmatic focus instead of autoFocus prop
  // autoFocus doesn't work reliably on first modal open in production
  const searchInputRef = useRef<Input>(null)

  useEffect(() => {
    if (isModalOpen) {
      // Small delay to ensure modal animation/focus trap is ready
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timeoutId)
    }
    return undefined
  }, [isModalOpen])

  const [activeTab, setActiveTab] = useState<SearchTab>(SearchTab.All)

  const { onChangeChainFilter, onChangeText, searchFilter, chainFilter, parsedChainFilter, parsedSearchFilter } =
    useFilterCallbacks(null, ModalName.Search)
  const debouncedSearchFilter = useDebounce(searchFilter)
  const debouncedParsedSearchFilter = useDebounce(parsedSearchFilter)

  const trace = useTrace({ section: SectionName.NavbarSearch })
  const onClose = useCallback(() => {
    toggleSearchModal()
    sendAnalyticsEvent(InterfaceEventName.NavbarSearchExited, {
      navbar_search_input_text: debouncedSearchFilter ?? '',
      hasInput: Boolean(debouncedSearchFilter),
      ...trace,
    })
  }, [toggleSearchModal, debouncedSearchFilter, trace])

  const onSelect = useCallback(() => {
    // web handles select differently than wallet as we want to clear search input on selection
    onChangeText('')
    onClose()
  }, [onChangeText, onClose])

  const onResetFilters = useCallback(() => {
    onChangeChainFilter(null)
    setActiveTab(SearchTab.All)
  }, [onChangeChainFilter])

  const { chains: enabledChains } = useEnabledChains()

  // Gui Dialog/Sheets should remove background scroll by default but does not work to disable ArrowUp/Down key scrolling
  useUpdateScrollLock({ isModalOpen })

  return (
    <Modal
      fullScreen
      hideKeyboardOnDismiss
      hideKeyboardOnSwipeDown
      renderBehindBottomInset
      backgroundColor={colors.surface1.val}
      isModalOpen={isModalOpen}
      maxWidth={640}
      maxHeight={520}
      name={ModalName.Search}
      padding="$none"
      height="100vh"
      onClose={onClose}
      analyticsProperties={{
        search_tab: activeTab,
      }}
      // Use percent mode to avoid Gui bug where 'fit' snapped
      // modals may incorrectly resize on their own when keyboard is visible
      snapPointsMode="percent"
      snapPoints={[85]}
    >
      <Flex grow style={scrollbarStyles}>
        <Flex
          $sm={{ px: '$spacing16', py: '$spacing4', borderColor: undefined, borderBottomWidth: 0 }}
          px="$spacing4"
          py="$spacing20"
          borderBottomColor="$surface3"
          borderBottomWidth={1}
        >
          <SearchTextInput
            ref={searchInputRef}
            minHeight={media.sm ? undefined : 24}
            backgroundColor={media.sm ? '$surface2' : '$none'}
            borderColor={!media.sm ? '$transparent' : undefined}
            borderWidth={!media.sm ? '$none' : undefined}
            py="$none"
            endAdornment={
              <Flex row alignItems="center">
                <NetworkFilter
                  includeAllNetworks
                  chainIds={enabledChains}
                  selectedChain={chainFilter}
                  onPressChain={onChangeChainFilter}
                />
              </Flex>
            }
            placeholder={t('search.input.placeholder.withWallets')}
            px="$spacing16"
            value={searchFilter ?? ''}
            onChangeText={onChangeText}
            onKeyPress={(e) => {
              if (['Enter', 'ArrowUp', 'ArrowDown'].includes(e.nativeEvent.key)) {
                // default behaviors we don't want:
                // - 'enter' key action blurs the input field
                // - 'arrow up/down' key action moves text cursor to the start/end of the input
                e.preventDefault()
              }
            }}
          />
        </Flex>
        <Flex row px="$spacing20" pt="$spacing16" pb="$spacing8" gap="$spacing16">
          {WEB_SEARCH_TABS.map((tab) => (
            <Trace element={ElementName.SearchTab} logPress key={tab} properties={{ search_tab: tab }}>
              <TouchableArea onPress={() => setActiveTab(tab)}>
                <Text color={activeTab === tab ? '$neutral1' : '$neutral2'} variant="buttonLabel2">
                  {tab}
                </Text>
              </TouchableArea>
            </Trace>
          ))}
        </Flex>
        <Flex grow>
          {searchFilter && searchFilter.length > 0 ? (
            <SearchModalResultsList
              chainFilter={chainFilter}
              parsedChainFilter={parsedChainFilter}
              debouncedParsedSearchFilter={debouncedParsedSearchFilter}
              debouncedSearchFilter={debouncedSearchFilter}
              searchFilter={searchFilter}
              activeTab={activeTab}
              onSelect={onSelect}
              onResetFilters={onResetFilters}
              renderedInModal={false}
            />
          ) : (
            <SearchModalNoQueryList
              chainFilter={chainFilter}
              activeTab={activeTab}
              onSelect={onSelect}
              renderedInModal
            />
          )}
        </Flex>
      </Flex>
    </Modal>
  )
})
