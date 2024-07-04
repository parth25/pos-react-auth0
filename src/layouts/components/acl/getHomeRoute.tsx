import { Role } from 'src/generated-sources/swagger-api'

/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: Role) => {
  return '/dashboard/statistics'
}

export default getHomeRoute
