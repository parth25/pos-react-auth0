// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Dashboard',
    icon: 'tabler:smart-home',
    children: [

      {
        title: 'Statistics',
        path: '/dashboard/statistics',
        action: 'DASHBOARD_DATA_VIEW'
      }
    ]
  }
]

export default navigation
