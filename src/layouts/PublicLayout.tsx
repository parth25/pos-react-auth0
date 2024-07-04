// ** MUI Imports
import React from 'react'
import { MenuItem } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import appConfig from 'src/configs/appConfig'

// ** Hook
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { BlankLayoutWithAppBarProps } from 'src/@core/layouts/types'
import { useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import LanguageDropdown from 'src/layouts/components/shared-components/LanguageDropdown'
import Translations from 'src/layouts/components/Translations'

export const LeadDefaultColours = {
  bgBlue: '#2070f0',
  bgBlueDark: '#185dec',
  bgOrange: '#f07020',
  bgOrangeDark: '#ec5d18'
}

const LinkStyled = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 16,
  display: 'inline-block',
  textDecoration: 'none',

  '@media (max-width: 600px)': {
    display: 'flex',
    paddingBottom: '.5rem',
    marginRight: 0,
    justifyContent: 'center'
  }
}))

const LinkStyledMenu = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: 16,
  display: 'inline-block',
  textDecoration: 'none',
  padding: '0.5rem 1rem',
  margin: '0rem 0.5rem'
}))

const BlankLayoutAppBar = () => {
  // ** Hooks & Vars
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const { skin } = settings
  const [mobileOpen, setMobileOpen] = useState(false)
  const lgAbove = useMediaQuery(theme.breakpoints.up('md'))

  const router = useRouter()

  const [activePage, setActivePage] = useState('')

  useEffect(() => {
    setActivePage(router.pathname)
  }, [router.pathname])

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState)
  }

  return (
    <AppBar
      color='default'
      position='fixed'
      elevation={skin === 'bordered' ? 0 : 3}
      sx={{
        backgroundColor: 'background.paper',
        ...(skin === 'bordered' && { borderBottom: `1px solid ${theme.palette.divider}` })
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          p: theme => `${theme.spacing(0, 6)} !important`,
          minHeight: `${70 - (skin === 'bordered' ? 1 : 0)}px !important`
        }}
      >
        <Link href={'/welcome'}>
          <img src='/images/masernet-logo-text.svg' alt='logo' width='200' />
        </Link>
        {lgAbove ? null : (
          <Box sx={{ '& .MuiButtonBase-root': { color: 'grey.800' } }}>
            <LanguageDropdown settings={settings} saveSettings={saveSettings} />
            <IconButton onClick={handleDrawerToggle}>
              <Icon fontSize={26} icon='tabler:menu-deep' />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex', alignItems: 'center' },
            '& .MuiMenuItem-root': { margin: 0, borderRadius: 0, padding: 0 },
            '& .MuiMenuItem-root:hover': {
              backgroundColor: 'transparent !important',
              color: `${router.pathname !== '/pricing' ? LeadDefaultColours.bgBlue : 'green'} !important`
            },
            '& .MuiMenuItem-root.Mui-selected': {
              backgroundColor: '#fff !important',
              borderBottom: `3px solid ${router.pathname !== '/pricing' ? LeadDefaultColours.bgBlue : 'green'}`
            },
            '& .MuiMenuItem-root.Mui-selected a': {
              color: `${router.pathname !== '/pricing' ? LeadDefaultColours.bgBlue : 'green'}`
            }
          }}
        >
          <MenuItem component='span' selected={activePage === '/welcome'}>
            <LinkStyledMenu href={'/welcome'}>
              <Translations text={'Home'} />
            </LinkStyledMenu>
          </MenuItem>
          <MenuItem component='span' selected={activePage === '/portal'}>
            <LinkStyledMenu href={'/portal'}>
              <Translations text={'Portals'} />
            </LinkStyledMenu>
          </MenuItem>
          <MenuItem component='span' selected={activePage === '/pricing'}>
            <LinkStyledMenu href={'/pricing'} sx={{ color: 'green' }}>
              <Translations text={'Free now!'} />
            </LinkStyledMenu>
          </MenuItem>
          <Link href='/login'>
            <Button
              variant='outlined'
              size='medium'
              sx={{
                ml: 4,
                borderColor: LeadDefaultColours.bgBlue, // Set the border color
                color: LeadDefaultColours.bgBlue, // Set the text color
                '&:hover': {
                  borderColor: LeadDefaultColours.bgBlueDark, // Change the border color on hover
                  color: LeadDefaultColours.bgBlueDark // Change the text color on hover
                }
              }}
            >
              <Translations text={'Signin'} />
            </Button>
          </Link>
          <Link href='/signup'>
            <Button
              variant='contained'
              size='medium'
              sx={{
                ml: 4,
                backgroundColor: LeadDefaultColours.bgOrange,
                color: 'white',
                '&:hover': {
                  backgroundColor: LeadDefaultColours.bgOrangeDark
                }
              }}
            >
              <Translations text={'Get Started'} />
            </Button>
          </Link>
          <Box
            sx={{
              ml: 4,
              display: 'flex'
            }}
          >
            <LanguageDropdown settings={settings} saveSettings={saveSettings} />
          </Box>
        </Box>
      </Toolbar>
      <Drawer
        variant='temporary'
        anchor={'top'}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true
        }}
        sx={{
          display: { md: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box' }
        }}
      >
        <Box>
          <List>
            <Box sx={{ px: 5, py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <img src='/images/masernet-beta-logo.png' alt='logo' height={30} />
              <IconButton onClick={handleDrawerToggle}>
                <Icon fontSize={26} icon='tabler:x' />
              </IconButton>
            </Box>
            <Divider />
            <Box
              sx={{
                px: 5,
                py: 3,
                '& .MuiMenuItem-root': { margin: 0, borderRadius: 0, padding: 0 },
                '& .MuiMenuItem-root:hover': {
                  backgroundColor: 'transparent !important',
                  color: `${LeadDefaultColours.bgBlue} !important`
                },
                '& .MuiMenuItem-root.Mui-selected': {
                  backgroundColor: '#fff !important'
                },
                '& .MuiMenuItem-root.Mui-selected a': {
                  color: `${LeadDefaultColours.bgBlue} !important`
                }
              }}
            >
              <MenuItem component='span' selected={activePage === '/welcome'}>
                <LinkStyledMenu href={'/welcome'}>
                  <Translations text={'Home'} />
                </LinkStyledMenu>
              </MenuItem>
              <MenuItem component='span' selected={activePage === '/portal'}>
                <LinkStyledMenu href={'/portal'}>
                  <Translations text={'Portals'} />
                </LinkStyledMenu>
              </MenuItem>
              <MenuItem component='span' selected={activePage === '/pricing'}>
                <LinkStyledMenu href={'/pricing'}>
                  <Translations text={'Pricing'} />
                </LinkStyledMenu>
              </MenuItem>
              <MenuItem component='span'>
                <LinkStyledMenu href={'/login'}>
                  <Translations text={'Signin'} />
                </LinkStyledMenu>
              </MenuItem>
              <MenuItem component='span'>
                <LinkStyledMenu href={'/signup'}>
                  <Translations text={'Get Started'} />
                </LinkStyledMenu>
              </MenuItem>
            </Box>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  )
}

const PublicAppFooter = () => {
  return (
    <Box sx={{ padding: theme => `${theme.spacing(6)}`, backgroundColor: 'background.paper' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { lg: 'row', sm: 'column', xs: 'column' },
          alignItems: { xs: 'center' },
          gap: 5
        }}
      >
        <Box>
          <Box sx={{ display: 'flex' }}>
            <Box component={'a'} href='/welcome/' sx={{ display: 'flex', alignItems: { xs: 'center' } }}>
              <img src='/images/masernet-logo-text.svg' alt='logo' height={20} />
            </Box>
          </Box>
        </Box>
        <Box>
          <LinkStyled href='/legal/term-and-condition' sx={{ marginRight: 5 }}>
            <Translations text={'Terms and Conditions'} />
          </LinkStyled>
          <LinkStyled href='/legal/privacy-policy' sx={{ marginRight: 5 }}>
            <Translations text={'Privacy Policy'} />
          </LinkStyled>
          <LinkStyled href='/legal/data-protection-addendum' sx={{ marginRight: 5 }}>
            <Translations text={'Data Protection Addendum'} />
          </LinkStyled>
          <LinkStyled href='/legal/cookie-policy'>
            <Translations text={'Cookies Policy'} />
          </LinkStyled>
        </Box>
        <Box>
          <IconButton
            href='https://twitter.com/yourmasernet'
            sx={{ marginRight: 1 }}
            component={Link}
            target={'_blank'}
          >
            <Icon icon='devicon:twitter' />
          </IconButton>
          <IconButton href='https://www.linkedin.com/company/masernet' component={Link} target={'_blank'}>
            <Icon icon='skill-icons:linkedin' width={'1.2em'} height={'1.2em'} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

const PublicLayoutAppBarWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  height: '100vh',
  backgroundColor: '#fff',

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
    minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
  },

  // For V2 Blank layout pages
  '& .content-right': {
    display: 'flex',
    overflowX: 'hidden',
    position: 'relative',
    minHeight: `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`
  }
}))

const PublicLayout = (props: BlankLayoutWithAppBarProps) => {
  // ** Props
  const { children } = props

  return (
    <PublicLayoutAppBarWrapper className='layout-content-wrapper'>
      <BlankLayoutAppBar />
      <Box
        className='app-content'
        sx={{
          position: 'relative',
          minHeight: theme => `calc(100vh - ${theme.spacing((theme.mixins.toolbar.minHeight as number) / 4)})`,
          backgroundColor: '#fff'
        }}
      >
        {children}
      </Box>
      <PublicAppFooter />
    </PublicLayoutAppBarWrapper>
  )
}

export default PublicLayout
