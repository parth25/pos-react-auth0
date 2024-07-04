import { useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import Spinner from 'src/layouts/components/spinner'
import { useTranslation } from 'react-i18next'
import { useApi } from 'src/hooks/useApi'
import { InitializeCheckerProps } from 'src/types/global'
import { isNonEmpty } from 'src/utils/miscellaneous'

const InitializeChecker = ({ children }: InitializeCheckerProps) => {
  const router = useRouter()
  const { backendApi } = useApi()
  const { i18n } = useTranslation()
  const dispatch = useDispatch()

  const userStore = useSelector((state: RootState) => state.user)
  const settingsStore = useSelector((state: RootState) => state.settings)
  const companyStore = useSelector((state: RootState) => state.company)
  const userEmailVerified = useMemo(() => userStore.profile?.data?.emailVerified, [userStore.profile.data])


  const shouldRedirectToEmailVerification = !userEmailVerified
  const shouldRedirectToRegistration =
    userEmailVerified &&
    (userStore.profile.data?.isRegistrationRequired ||
      !isNonEmpty(companyStore.info.data) ||
      !isNonEmpty(userStore.profile.data?.leadPortals)) &&
    !['/register/'].includes(router.asPath)

  useEffect(() => {
    if (shouldRedirectToEmailVerification) {
      router.replace('/register')
    }
  }, [
    shouldRedirectToEmailVerification,
    shouldRedirectToRegistration,
    i18n.language,
    userStore.profile,
    companyStore.info,
    settingsStore?.user.data?.PORTAL_COUNTRY
  ])

  if ( shouldRedirectToRegistration) {
    return <Spinner />
  }

  return <>{children}</>
}
export default InitializeChecker
