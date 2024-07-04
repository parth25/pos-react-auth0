// ** React Imports
import { ReactElement, ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface GuestGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const GuestGuard = (props: GuestGuardProps) => {
  const { children, fallback } = props
  const { isLoading, user } = useAuth() // TODO check this again
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    if (user) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route, user])

  if (isLoading || (!isLoading && user !== undefined)) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
