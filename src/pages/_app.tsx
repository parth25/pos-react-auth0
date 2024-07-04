// ** React Imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import React, { ReactNode, useCallback } from 'react'

// ** Next Imports
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Store Imports
import { RootState, store } from 'src/store'
import { Provider, useSelector } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/layouts/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/layouts/components/auth/AuthGuard'
import GuestGuard from 'src/layouts/components/auth/GuestGuard'

// ** Spinner Import
import Spinner from 'src/layouts/components/spinner'

// ** Contexts
import { Auth0Provider } from '@auth0/auth0-react'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import 'styles/globals.css'

import axios from 'axios'
import { useAuth } from 'src/hooks/useAuth'
import appConfig from 'src/configs/appConfig'
import { ApiProvider } from 'src/context/ApiContext'
import { isDefined, useRouterRef } from 'src/utils/miscellaneous'
import { User } from '@auth0/auth0-spa-js'
import { AppState } from '@auth0/auth0-react'
import 'driver.js/dist/driver.css'
import 'styles/driverjsTheme.css'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<Spinner />}>{children}</AuthGuard>
  }
}

const AppHead = () => {
  const companyInfo = useSelector((state: RootState) => state.company.info)

  return (
    <Head>
      <title>
        {companyInfo?.data?.name
          ? `${companyInfo?.data?.name} - ${themeConfig.templateTitle}`
          : themeConfig.templateTitle}
      </title>
      <link rel='icon' href={companyInfo?.data?.faviconIcon || '/images/masernet-logo.svg'} sizes='any' />
      <meta
        name='description'
        content={`We're providing individual lead identification based on your company's portfolio! Manage the whole lifecycle of your leads in one place together as a team!`}
      />
      <meta name='viewport' content='initial-scale=1, width=device-width' />
      <meta name='robots' content='index, follow' />
    </Head>
  )
}

const ApiProviderCustom = (props: ExtendedAppProps) => {
  const { Component, pageProps } = props

  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false

  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)

  const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  const aclAbilities = Component.acl ?? defaultACLObj

  const queryClient = new QueryClient()

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth()

  const instance = axios.create()

  if (isDefined(user) && isAuthenticated) {
    instance.interceptors.request.use(
      async config => {
        const accessToken = await getAccessTokenSilently()
        config.headers.Authorization = `Bearer ${accessToken}`

        return config
      },
      error => error
    )
  }

  return (
    <ApiProvider instance={instance}>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <AppHead />
                  <Guard authGuard={authGuard} guestGuard={guestGuard}>
                    <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                      {getLayout(<Component {...pageProps} />)}
                    </AclGuard>
                  </Guard>
                  <ReactHotToast>
                    <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                  </ReactHotToast>
                </ThemeComponent>
              )
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </QueryClientProvider>
    </ApiProvider>
  )
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { emotionCache = clientSideEmotionCache } = props
  const routerRef = useRouterRef()

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleOnRedirectCallback = useCallback((appState?: AppState, user?: User) => {
    const returnTo = appState?.returnTo

    switch (true) {
      case !isDefined(returnTo) || returnTo === '/':
        // Handle undefined or null case
        return null
      default:
        // Handle other cases
        return routerRef.current.push(returnTo as string)
    }
  }, [])

  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Auth0Provider
          domain={appConfig.auth.CLIENT_DOMAIN}
          clientId={appConfig.auth.CLIENT_ID}
          authorizationParams={{
            audience: appConfig.auth.AUDIENCE,
            scope: appConfig.auth.SCOPE.split(',').join(' '),
            redirect_uri: global?.window && window?.location?.origin
          }}
          cacheLocation='localstorage'
          onRedirectCallback={handleOnRedirectCallback}
        >
          <ApiProviderCustom {...props} />
        </Auth0Provider>
      </CacheProvider>
    </Provider>
  )
}

export default App
