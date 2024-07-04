// ** React Imports
import React, { ReactNode, useState } from 'react'

// ** MUI Imports
import { Theme, styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import { bottomNavigation, navigation } from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'
import { isNonEmpty } from 'src/utils/miscellaneous'
import Translations from './components/Translations'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

import Box from '@mui/material/Box'
import themeConfig from 'src/configs/themeConfig'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import appConfig from 'src/configs/appConfig'
import List from '@mui/material/List'
import VerticalNavItems from 'src/@core/layouts/components/vertical/navigation/VerticalNavItems'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 650,
  lineHeight: '24px',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const FooterTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 400,
  lineHeight: '24px',
  fontSize: '1rem !important',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const AppBrand = (props: any) => {
  const { navHover, settings } = props

  // ** Hooks & Vars
  const { navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }
  const companyStore = useSelector((state: RootState) => state.company)

  return (
    <LinkStyled href='/' sx={{ maxWidth: '85%' }}>
      {isNonEmpty(companyStore?.info?.data?.faviconIcon) && (
        <img src={companyStore?.info?.data?.faviconIcon} alt='logo' width='34' height='34' />
      )}
      <HeaderTitle
        variant='h4'
        sx={{
          textDecoration: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ...menuCollapsedStyles,
          ...(navCollapsed && !navHover ? {} : { ml: 2.5 })
        }}
      >
        {companyStore?.info.data?.name}
      </HeaderTitle>
    </LinkStyled>
  )
}

const AppFooter = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100' }}>
      <FooterTitle variant='h6'>
        <Translations text={'Version'} /> {'-'} {appConfig.version}
      </FooterTitle>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LinkStyled href='/'>
          <img src='/images/masernet-beta-logo.png' alt='logo' height='20' />
        </LinkStyled>
      </Box>
    </Box>
  )
}

const BottomVerticalNavItems = (props: any) => {
  const [groupActive, setGroupActive] = useState<string[]>([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([])

  return (
    <List className='nav-items' sx={{ pt: 0, mt: 'auto', '& > :first-child': { mt: '0' } }}>
      <VerticalNavItems
        navHover={props.navHover}
        groupActive={groupActive}
        setGroupActive={setGroupActive}
        currentActiveGroup={currentActiveGroup}
        setCurrentActiveGroup={setCurrentActiveGroup}
        settings={props.settings}
        saveSettings={props.saveSettings}
        navigationBorderWidth={props.navigationBorderWidth}
        verticalNavItems={bottomNavigation}
      />
    </List>
  )
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  const navigationBorderWidth = settings.skin === 'bordered' ? 1 : 0
  const collapsedNavWidth = themeConfig.collapsedNavigationSize

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: navigation,
          branding: props => <AppBrand {...props} />,
          componentProps: {
            sx: { '& .nav-header': { paddingLeft: (collapsedNavWidth - navigationBorderWidth - 34) / 8 } }
          },
          lockedIcon: <Icon icon='tabler:pin-filled' />,
          unlockedIcon: <Icon icon='tabler:pin' />,
          afterContent: BottomVerticalNavItems

          // Uncomment the below line when using server-side menu in vertical layout and comment the above line
          // navItems: verticalMenuItems
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems()

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
      footerProps={{
        content: () => <AppFooter />
      }}
    >
      {children}
    </Layout>
  )
}

export default UserLayout
