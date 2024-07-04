import { ReactNode, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useApi } from 'src/hooks/useApi'
import { useDispatch, useSelector } from 'react-redux'
import InitializeChecker from 'src/layouts/components/initialization/InitializeChecker'
import { getUserProfile } from 'src/store/user'
import { RootState } from 'src/store'
import { isNonEmpty } from 'src/utils/miscellaneous'
import Spinner from 'src/layouts/components/spinner'
import { getAllUserSettingsPersonal } from 'src/store/settings'

type InitializeAuthProps = {
  children: ReactNode
}

const InitializeApp = (props: InitializeAuthProps) => {
  const { children } = props
  const { backendApi } = useApi()
  const { i18n } = useTranslation()

  const dispatch = useDispatch()
  const userStore = useSelector((state: RootState) => state.user)
  const settingsStore = useSelector((state: RootState) => state.settings)

  const isUserProfileEmpty = useMemo(() => !isNonEmpty(userStore.profile.data), [userStore.profile.data])
  const isSettingsEmpty = useMemo(() => !isNonEmpty(settingsStore.user.data), [settingsStore.user.data])

  useEffect(() => {
    if (isUserProfileEmpty) {
      dispatch(getUserProfile({ backendApi: backendApi, languageCode: i18n.language })).then(() => {
        dispatch(getAllUserSettingsPersonal({ backendApi: backendApi, settingName: null }))
      })
    }
  }, [dispatch, isUserProfileEmpty])

  if (isUserProfileEmpty || isSettingsEmpty) {
    return <Spinner />
  }

  return <InitializeChecker>{children}</InitializeChecker>
}

export default InitializeApp
