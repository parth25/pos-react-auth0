import { ReactNode, createContext } from 'react'
import { ApiContextType } from 'src/types/global'
import BackendApi from 'src/api/BackendApi'
import { useAuth } from 'src/hooks/useAuth'
import { isDefined } from 'src/utils/miscellaneous'
import { AxiosInstance } from 'axios'
import appConfig from 'src/configs/appConfig'

type Props = {
  instance: AxiosInstance
  children: ReactNode
}

const defaultProvider: ApiContextType = {
  backendApi: new BackendApi(undefined, appConfig.backend_base_url, undefined, appConfig.machine_learning_base_url)
}

const ApiContext = createContext(defaultProvider)

const ApiProvider = ({ instance, children }: Props) => {
  // ** Hooks
  const { user, isAuthenticated } = useAuth()

  if (isDefined(user) && isAuthenticated) {
    const authenticatedProvider: ApiContextType = {
      backendApi: new BackendApi(undefined, appConfig.backend_base_url, instance, appConfig.machine_learning_base_url)
    }

    return <ApiContext.Provider value={authenticatedProvider}>{children}</ApiContext.Provider>
  } else {
    return <ApiContext.Provider value={defaultProvider}>{children}</ApiContext.Provider>
  }
}

export { ApiContext, ApiProvider }
