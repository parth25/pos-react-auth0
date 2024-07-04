// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

export const navigation: VerticalNavItemsType = [
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

export const bottomNavigation: VerticalNavItemsType = [

]
