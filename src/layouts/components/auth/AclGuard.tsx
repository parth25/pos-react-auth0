// ** React Imports
import { ReactNode, useEffect, useMemo } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

// ** Types
import type { ACLObj, AppAbility } from 'src/configs/acl'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/layouts/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Util Import
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'
import { RootState } from 'src/store'
import { Role } from 'src/generated-sources/swagger-api'
import { customAbilityCan, toCamelCase } from 'src/utils/miscellaneous'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props

  // ** Hooks
  const { user } = useAuth()
  const router = useRouter()

  const userProfile = useSelector((state: RootState) => state.user.profile.data)
  const companyInfo = useSelector((state: RootState) => state.company.info.data)

  const companyAbilities = useMemo(() => {
    return Object.entries(companyInfo?.plan ?? {})
      .filter(([key, value]) => typeof value === 'boolean' && value)
      .map(([key]) => `COMPANY_SUBSCRIPTION_${toCamelCase(key).toUpperCase()}`)
  }, [companyInfo?.plan])

  // ** Vars
  let ability: AppAbility

  useEffect(() => {
    if (user && userProfile?.role && !guestGuard && router.route === '/') {
      const homeRoute = getHomeRoute(userProfile?.role)
      router.replace(homeRoute)
    }
  }, [user, userProfile?.role, guestGuard, router])

  // User is logged in, build ability for the user based on his role
  if (user && !ability) {
    ability = buildAbilityFor(
      userProfile?.role as Role,
      companyAbilities,
      userProfile?.permissionsValue as string,
      aclAbilities.subject
    )
    if (router.route === '/') {
      return <Spinner />
    }
  }

  // If guest guard or no guard is true or any error page
  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    // If user is logged in and his ability is built
    if (user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // If user is not logged in (render pages like login, register etc..)
      return <>{children}</>
    }
  }

  // Check the access of current user and render pages
  if (ability && user && customAbilityCan(aclAbilities.action, ability, aclAbilities.subject)) {
    if (router.route === '/') {
      return <Spinner />
    }

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
