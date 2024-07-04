// ** React Imports
import { withAuthenticationRequired } from '@auth0/auth0-react'
import { ReactElement, ReactNode } from 'react'

// ** Hooks Import
import InitializeApp from 'src/layouts/components/initialization/InitializeApp'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children } = props

  return <InitializeApp>{children}</InitializeApp>
}

export default withAuthenticationRequired(AuthGuard)
