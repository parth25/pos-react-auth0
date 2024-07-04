// ** React Imports
import { ReactNode, useEffect } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Spinner from 'src/layouts/components/spinner'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const LogoutPage = () => {
  // ** Hooks
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      logout({ logoutParams: { returnTo: window.location.origin } })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  return <Spinner />
}

LogoutPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
LogoutPage.authGuard = false

export default LogoutPage
