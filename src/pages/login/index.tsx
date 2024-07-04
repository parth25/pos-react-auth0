// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Spinner from 'src/layouts/components/spinner'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const LoginPage = () => {
  // ** Hooks
  const { isAuthenticated, loginWithRedirect } = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (!isAuthenticated) {
        loginWithRedirect({
          authorizationParams: { prompt: 'login' }
        })
      } else {
        router.replace('/dashboard/statistics')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  return <Spinner />
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
