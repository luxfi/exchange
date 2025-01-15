import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import Web3Status from 'components/Web3Status'
import { NftListV2Variant, useNftListV2Flag } from 'featureFlags/flags/nftListV2'
import { chainIdToBackendName } from 'graphql/data/util'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { Box } from 'nft/components/Box'
import { Column, Row } from 'nft/components/Flex'
import { useProfilePageState } from 'nft/hooks'
import { ProfilePageStateType } from 'nft/types'
import { ReactNode, useReducer, useRef, useState } from 'react'
import { Navigate, NavLink, NavLinkProps, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'
import { useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { NavDropdown } from './NavDropdown'

import { body, bodySmall } from 'nft/css/common.css'
import { Bag } from './Bag'
import { ChainSelector } from './ChainSelector'
import { MenuDropdown } from './MenuDropdown'
import * as menustyles from './MenuDropdown.css'
import { SearchBar } from './SearchBar'
import * as styles from './style.css'
import { ParentSize } from '@visx/responsive'

const Nav = styled.nav`
  padding: 20px 12px;
  width: 100%;
  height: ${({ theme }) => theme.navHeight}px;
  z-index: 2;
`

interface MenuItemProps {
  href: string
  id?: NavLinkProps['id']
  isActive?: boolean
  children: ReactNode
  dataTestId?: string
}

const MenuItem = ({ href, dataTestId, id, isActive, children, onClick }: MenuItemProps & { onClick?: () => void }) => {
  return (
    <NavLink
      to={href}
      className={isActive ? styles.activeMenuItem : styles.menuItem}
      id={id}
      style={{ textDecoration: 'none' }}
      data-testid={dataTestId}
      onClick={onClick} // Trigger parent-provided onClick
    >
      {children}
    </NavLink>
  );
};

const PrimaryMenuRow = ({
  to,
  href,
  close,
  children,
}: {
  to?: NavLinkProps['to']
  href?: string
  close?: () => void
  children: ReactNode
}) => {
  return (
    <>
      {to ? (
        <NavLink to={to} className={menustyles.MenuRow}>
          <Row onClick={close}>{children}</Row>
        </NavLink>
      ) : (
        <Row as="a" href={href} target="_blank" rel="noopener noreferrer" className={menustyles.MenuRow}>
          {children}
        </Row>
      )}
    </>
  )
}

const StyledBox = styled(Box)`
  align-items: center;
  display: flex;
  justify-content: center;
`
const PrimaryMenuRowText = ({ children }: { children: ReactNode }) => {
  return <StyledBox className={`${menustyles.PrimaryText} ${body}`}>{children}</StyledBox>
}

PrimaryMenuRow.Text = PrimaryMenuRowText

const SecondaryLinkedText = ({
  href,
  onClick,
  children,
}: {
  href?: string
  onClick?: () => void
  children: ReactNode
}) => {
  return (
    <Box
      as={href ? 'a' : 'div'}
      href={href ?? undefined}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={`${menustyles.SecondaryText} ${bodySmall}`}
      onClick={onClick}
      cursor="pointer"
    >
      {children}
    </Box>
  )
}

const Separator = () => {
  return <Box className={menustyles.Separator} />
}

const IconRow = ({ children }: { children: ReactNode }) => {
  return <Row className={menustyles.IconRow}>{children}</Row>
}

const Icon = ({ href, children }: { href?: string; children: ReactNode }) => {
  return (
    <>
      <Box
        as={href ? 'a' : 'div'}
        href={href ?? undefined}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
        display="flex"
        flexDirection="column"
        color="textPrimary"
        background="none"
        border="none"
        justifyContent="center"
        textAlign="center"
        marginRight="12"
      >
        {children}
      </Box>
    </>
  )
}

export const PageTabs = () => {
  const { pathname } = useLocation();
  const { chainId: connectedChainId } = useWeb3React();
  const chainName = chainIdToBackendName(connectedChainId);

  const isPoolActive =
    pathname.startsWith('/pool') ||
    pathname.startsWith('/add') ||
    pathname.startsWith('/remove') ||
    pathname.startsWith('/increase') ||
    pathname.startsWith('/find');

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleBoxItemClick = () => {
    navigate(`/explore/tokens/${chainName.toLowerCase()}`);
    setIsOpen(false); // Close dropdown
  };

  const handleMouseEnter = () => {
    setIsOpen(true); // Open dropdown
  };

  const handleMouseLeave = () => {
    setIsOpen(false); // Close dropdown
  };

  const handleMenuItemClick = () => {
    setIsOpen(false); // Close dropdown when a menu item is clicked
  };

  return (
    <>
      <Box
        position="relative"
        className={pathname.startsWith('/explore') ? styles.activeMenuItem : styles.menuItem}
        color={pathname.startsWith('/explore') ? 'textPrimary' : 'textSecondary'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        style={{
          display: 'inline-block',
          cursor: 'pointer'
        }}
      >
        {/* Explore Button */}
        <Box
          onClick={handleBoxItemClick}
        >
          <Trans>Explore</Trans>
        </Box>

        {/* Dropdown Menu */}
        {isOpen && (
          <Box position="absolute" left="0">
            <NavDropdown
              top={{ sm: 'unset', lg: '8' }}
              bottom={{ sm: '56', lg: 'unset' }}
              left="0"
            >
              <Column gap="16">
                <Column paddingX="8">
                  <MenuItem
                    href={`/explore/tokens/${chainName.toLowerCase()}`}
                    isActive={pathname.startsWith('/explore/tokens')}
                    onClick={handleMenuItemClick}
                  >
                    <Trans>Tokens</Trans>
                  </MenuItem>
                  <MenuItem
                    href={`/explore/pools/${chainName.toLowerCase()}`}
                    isActive={pathname.startsWith('/explore/pools')}
                    onClick={handleMenuItemClick}
                  >
                    <Trans>Pools</Trans>
                  </MenuItem>
                  <MenuItem
                    href={`/explore/transactions/${chainName.toLowerCase()}`}
                    isActive={pathname.startsWith('/explore/transactions')}
                    onClick={handleMenuItemClick}
                  >
                    <Trans>Transactions</Trans>
                  </MenuItem>
                </Column>
              </Column>
            </NavDropdown>
          </Box>
        )}
      </Box>

      {/* Other Menu Items */}
      <MenuItem href="/pool" id="pool-nav-link" isActive={isPoolActive}>
        <Trans>Portfolio</Trans>
      </MenuItem>
      <MenuItem href="/swap" isActive={pathname.startsWith('/swap')}>
        <Trans>Trade</Trans>
      </MenuItem>
    </>
  );
};

const Navbar = () => {
  const isNftPage = useIsNftPage()
  const sellPageState = useProfilePageState((state) => state.state)
  const isNftListV2 = useNftListV2Flag() === NftListV2Variant.Enabled
  const navigate = useNavigate()

  return (
    <>
      <Nav>
        <Box className={styles.logoContainer} display={{ sm: 'none', lg: 'flex' }}>
        </Box>
        <Box display="flex" height="full" flexWrap="nowrap">
          <Box className={styles.leftSideContainer}>
          <MenuDropdown />
            {!isNftPage && (
              <Box display={{ sm: 'flex', lg: 'none' }}>
                <ChainSelector leftAlign={true} />
              </Box>
            )}
            <Row gap={{ xl: '0', xxl: '8' }} display={{ sm: 'none', lg: 'flex' }}>
              <PageTabs />
            </Row>
          </Box>
          <Box className={styles.searchContainer}>
            <SearchBar />
          </Box>
          <Box className={styles.rightSideContainer}>
            <Row gap="12">
              <Box position="relative" display={{ sm: 'flex', xl: 'none' }}>
                <SearchBar />
              </Box>
              {isNftPage && (!isNftListV2 || sellPageState !== ProfilePageStateType.LISTING) && <Bag />}
              {!isNftPage && (
                <Box display={{ sm: 'none', lg: 'flex' }}>
                  <ChainSelector />
                </Box>
              )}

              <Web3Status />
            </Row>
          </Box>
        </Box>
      </Nav>
    </>
  )
}

export default Navbar
