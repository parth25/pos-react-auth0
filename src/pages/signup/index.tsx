// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Spinner from 'src/layouts/components/spinner'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const Signup = () => {
  // ** Hooks
  const { isAuthenticated, loginWithRedirect } = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (!isAuthenticated) {
        loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })
      } else {
        router.replace('/dashboard/statistics')
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  return <Spinner />
}

Signup.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Signup.guestGuard = true

export default Signup
