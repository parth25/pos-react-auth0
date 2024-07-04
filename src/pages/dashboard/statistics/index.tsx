import Backdrop from '@mui/material/Backdrop'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Box, CardHeader, FormControl, Grid, MenuItem, Select } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useQuery } from '@tanstack/react-query'
import format from 'date-fns/format'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { Theme, useTheme } from '@mui/material/styles'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { LeadsGraphOptions } from 'src/types/global'
import { useApi } from 'src/hooks/useApi'
import { RootState } from 'src/store'
import { isDefined } from 'src/utils/miscellaneous'
import Paper from '@mui/material/Paper'
import Translations from 'src/layouts/components/Translations'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useRouter } from 'next/router'
import { LeadGraphItem } from 'src/generated-sources/swagger-api'

import { CompanyStatusEnum } from 'src/utils/enum'

const Dashboard = () => {
  // ** State
  const theme = useTheme()

  // ** To use mode (light/dark/semi-dark), skin(default/bordered), direction(ltr/rtl), etc. for conditional styles, uncomment below line
  const { settings } = useSettings()

  // ** To use mode (light/dark/semi-dark), skin(default/bordered), direction(ltr/rtl), etc. for conditional styles, uncomment below line
  const { mode } = settings

  const { backendApi } = useApi()
  const { t } = useTranslation()
  const router = useRouter()

  const settingsStore = useSelector((state: RootState) => state.settings)

  const companyStore = useSelector((state: RootState) => state.company)

  const [leadsGraphSelectedOption, setLeadsGraphSelectedOption] = useState<LeadsGraphOptions>('LAST_7_DAYS')

  const renderLeadGraph = (theme: Theme, data: Array<LeadGraphItem>) => {
    const series = [
      {
        name: 'leads',
        data: data.map((item: LeadGraphItem) => ({ x: item.date, y: item.count }))
      }
    ]
    const options = {
      colors: [theme.palette.primary.dark],
      states: {
        hover: {
          filter: { type: 'none' }
        },
        active: {
          filter: { type: 'none' }
        }
      },
      chart: {
        foreColor: mode === 'light' ? '#212121' : 'rgba(228, 230, 244, 0.80)',
        sparkline: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      yaxis: {
        title: {
          text: t('Count')
        },
        labels: {
          formatter(value: number) {
            return value.toFixed(0)
          }
        }
      },
      tooltip: {
        theme: mode === 'light' ? 'light' : 'dark'
      },
      grid: { show: false }
    }

    return <ReactApexcharts type='bar' width='100%' options={options} series={series} />
  }

  const graphDateChangeHandler = (e: any) => {
    setLeadsGraphSelectedOption(e.target.value)
  }

  const getDateRange = (option: LeadsGraphOptions) => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()

    switch (option) {
      case 'LAST_7_DAYS':
        return [
          new Date(new Date(today).setDate(today.getDate() - 7)),
          new Date(new Date(today).setDate(today.getDate() - 1))
        ]

      case 'LAST_14_DAYS':
        return [
          new Date(new Date(today).setDate(today.getDate() - 14)),
          new Date(new Date(today).setDate(today.getDate() - 1))
        ]

      case 'LAST_30_DAYS':
        return [
          new Date(new Date(today).setDate(today.getDate() - 30)),
          new Date(new Date(today).setDate(today.getDate() - 1))
        ]

      case 'LAST_3_MONTHS':
        return [new Date(currentYear, currentMonth - 2, 1), new Date(currentYear, currentMonth, today.getDate() - 1)]
      default:
        return [null, null]
    }
  }

  const [startDate, endDate] = getDateRange(leadsGraphSelectedOption)

  const dashboardLeadGraphResponse = useQuery({
    queryKey: ['dashboardLeadGraphData'],
    queryFn: async () => {
      const response = await backendApi.dashboardApi.leadGraphData(
        format(startDate as Date, 'yyyy-MM-dd'),
        format(endDate as Date, 'yyyy-MM-dd')
      )

      return response.data
    },
    enabled: !!startDate && !!endDate,
    refetchOnWindowFocus: false
  })

  const dashboardSummaryResponse = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const response = await backendApi.dashboardApi.dashboardSummary(
        settingsStore?.user.data?.PORTAL_COUNTRY?.portalCountry?.id
      )

      return response.data
    },
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    dashboardLeadGraphResponse.refetch()
  }, [leadsGraphSelectedOption, settingsStore?.user?.data?.PORTAL_COUNTRY])

  useEffect(() => {
    dashboardSummaryResponse.refetch()
  }, [])

  const DashboardCardTitle = (props: any) => {
    const { title } = props

    return (
      <Box className={'MuiCardHeader-Box'}>
        <Typography className={'MuiCardHeader-Title'}>{title}</Typography>
      </Box>
    )
  }

  const childParentStatusGet = (status: string) => {
    const parentStatusId = companyStore?.info?.data?.leadStatuses.find(item => item?.status === status)

    const childStatus = companyStore?.info?.data?.leadStatuses
      ?.filter(item => item?.parentId === parentStatusId?.id)
      ?.map(item => item?.status)

    return [parentStatusId?.status, ...childStatus] as string[]
  }

  return (
    <>
      <Grid id={'dashboard'} container spacing={3} sx={{ position: 'relative' }}>
        <Grid item xs={12} md={12} sx={{ '& .MuiCard-root': { overflow: 'initial' } }}>
          <Card
            variant={'elevation'}
            sx={{
              '& .MuiCardHeader-Box': { position: 'relative' },
              '& .MuiCardHeader-Title': {
                position: 'absolute',
                top: -15,
                left: 24,
                fontSize: '1.15rem',
                color: 'primary.dark',
                fontWeight: 600
              }
            }}
          >
            <DashboardCardTitle title={<Translations text={'Leads'} />} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.lead)
                            ? dashboardSummaryResponse?.data?.lead.activeCount
                            : ''}
                        </Typography>
                        <Typography variant='body2'>{<Translations text={'Active Leads'} />}</Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:wallet' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}

                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden'
                        }}
                      >
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.lead)
                            ? dashboardSummaryResponse?.data?.lead.suggestedCount
                            : ''}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}
                        >
                          {<Translations text={'Suggested Leads'} />}
                        </Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:wallet' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}

                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.lead)
                            ? dashboardSummaryResponse?.data?.lead.ownCount
                            : ''}
                        </Typography>
                        <Typography variant='body2'>{<Translations text={'My Leads'} />}</Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:wallet' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}

                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.lead)
                            ? dashboardSummaryResponse?.data?.lead.qualifiedCount
                            : ''}
                        </Typography>
                        <Typography variant='body2'>{<Translations text={'Qualified Leads'} />}</Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:wallet' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}

                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.lead)
                            ? dashboardSummaryResponse?.data?.lead.confirmedCount
                            : ''}
                        </Typography>
                        <Typography variant='body2'>{<Translations text={'Confirmed Leads'} />}</Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:wallet' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}

                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.lead)
                            ? dashboardSummaryResponse?.data?.lead.rejectedCount
                            : ''}
                        </Typography>
                        <Typography variant='body2'>{<Translations text={'Rejected Leads'} />}</Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:wallet' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12} sx={{ '& .MuiCard-root': { overflow: 'initial' }, mt: 3 }}>
          <Card
            variant={'elevation'}
            sx={{
              '& .MuiCardHeader-Box': { position: 'relative' },
              '& .MuiCardHeader-Title': {
                position: 'absolute',
                top: -15,
                left: 24,
                fontSize: '1.15rem',
                color: 'primary.dark',
                fontWeight: 600
              }
            }}
          >
            <DashboardCardTitle title={<Translations text={'Products'} />} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/portfolio/products')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.asset)
                            ? dashboardSummaryResponse?.data?.asset.allCount
                            : ''}
                        </Typography>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant='body2'>{<Translations text={'All Products'} />}</Typography>
                          <Icon icon={settingsStore?.user?.data?.PORTAL_COUNTRY?.portalCountry?.icon} fontSize={18} />
                        </Box>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:briefcase' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/portfolio/products')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.asset)
                            ? dashboardSummaryResponse?.data?.asset.confirmedCount
                            : ''}
                        </Typography>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant='body2'>{<Translations text={'Confirmed Products'} />}</Typography>
                          <Icon icon={settingsStore?.user?.data?.PORTAL_COUNTRY?.portalCountry?.icon} fontSize={18} />
                        </Box>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:briefcase' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/portfolio/products')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.asset)
                            ? dashboardSummaryResponse?.data?.asset.suggestedCount
                            : ''}
                        </Typography>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant='body2'>{<Translations text={'Suggested Products'} />}</Typography>
                          <Icon icon={settingsStore?.user?.data?.PORTAL_COUNTRY?.portalCountry?.icon} fontSize={18} />
                        </Box>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:briefcase' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12} sx={{ '& .MuiCard-root': { overflow: 'initial' }, mt: 3 }}>
          <Card
            variant={'elevation'}
            sx={{
              '& .MuiCardHeader-Box': { position: 'relative' },
              '& .MuiCardHeader-Title': {
                position: 'absolute',
                top: -15,
                left: 24,
                fontSize: '1.15rem',
                color: 'primary.dark',
                fontWeight: 600
              }
            }}
          >
            <DashboardCardTitle title={<Translations text={'Services'} />} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/portfolio/services')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.service)
                            ? dashboardSummaryResponse?.data?.service.allCount
                            : ''}
                        </Typography>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant='body2'>{<Translations text={'All Services'} />}</Typography>
                          <Icon icon={settingsStore?.user?.data?.PORTAL_COUNTRY?.portalCountry?.icon} fontSize={18} />
                        </Box>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:briefcase' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/portfolio/services')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.service)
                            ? dashboardSummaryResponse?.data?.service.confirmedCount
                            : ''}
                        </Typography>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant='body2'>{<Translations text={'Confirmed Services'} />}</Typography>
                          <Icon icon={settingsStore?.user?.data?.PORTAL_COUNTRY?.portalCountry?.icon} fontSize={18} />
                        </Box>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:briefcase' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/portfolio/services')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.service)
                            ? dashboardSummaryResponse?.data?.service.suggestedCount
                            : ''}
                        </Typography>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant='body2'>{<Translations text={'Suggested Services'} />}</Typography>
                          <Icon icon={settingsStore?.user?.data?.PORTAL_COUNTRY?.portalCountry?.icon} fontSize={18} />
                        </Box>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:briefcase' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12} sx={{ '& .MuiCard-root': { overflow: 'initial' }, mt: 3 }}>
          <Card
            variant={'elevation'}
            sx={{
              '& .MuiCardHeader-Box': { position: 'relative' },
              '& .MuiCardHeader-Title': {
                position: 'absolute',
                top: -15,
                left: 24,
                fontSize: '1.15rem',
                color: 'primary.dark',
                fontWeight: 600
              }
            }}
          >
            <DashboardCardTitle title={<Translations text={'Documents'} />} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/documents')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.document)
                            ? dashboardSummaryResponse?.data?.document.allCount
                            : ''}
                        </Typography>
                        <Typography variant='body2'>{<Translations text={'All Documents'} />}</Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:files' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/documents')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.document)
                            ? dashboardSummaryResponse?.data?.document.companyCount
                            : ''}
                        </Typography>
                        <Typography variant='body2'>{<Translations text={'Company Documents'} />}</Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:files' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/documents')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.document)
                            ? dashboardSummaryResponse?.data?.document.tenderCount
                            : ''}
                        </Typography>
                        <Typography variant='body2'>{<Translations text={'Tender Documents'} />}</Typography>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:files' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12} sx={{ '& .MuiCard-root': { overflow: 'initial' }, mt: 3 }}>
          <Card
            variant={'elevation'}
            sx={{
              '& .MuiCardHeader-Box': { position: 'relative' },
              '& .MuiCardHeader-Title': {
                position: 'absolute',
                top: -15,
                left: 24,
                fontSize: '1.15rem',
                color: 'primary.dark',
                fontWeight: 600
              }
            }}
          >
            <DashboardCardTitle title={<Translations text={'Taxonomy'} />} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/user-settings/taxonomy')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.taxonomy)
                            ? dashboardSummaryResponse?.data?.taxonomy.allCount
                            : ''}
                        </Typography>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant='body2'>{<Translations text={'All Taxonomy'} />}</Typography>
                          <Icon icon={settingsStore?.user?.data?.PORTAL_COUNTRY?.portalCountry?.icon} fontSize={18} />
                        </Box>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:topology-star' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Paper variant='outlined'>
                    <CardContent
                      sx={{
                        gap: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onClick={() => router.push('/user-settings/taxonomy')}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography variant='h5'>
                          {isDefined(dashboardSummaryResponse?.data?.taxonomy)
                            ? dashboardSummaryResponse?.data?.taxonomy.userCount
                            : ''}
                        </Typography>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant='body2'>{<Translations text={'User Taxonomy'} />}</Typography>
                          <Icon icon={settingsStore?.user?.data?.PORTAL_COUNTRY?.portalCountry?.icon} fontSize={18} />
                        </Box>
                      </Box>
                      <CustomAvatar skin='light' color={'primary'} sx={{ width: 42, height: 42 }}>
                        <Icon icon='tabler:topology-star' fontSize={24} />
                      </CustomAvatar>
                    </CardContent>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Backdrop
          open={isDefined(dashboardSummaryResponse.isLoading) ? dashboardSummaryResponse?.isLoading : false}
          sx={{
            ml: 3,
            mt: 3,
            position: 'absolute',
            borderRadius: 1,
            color: 'common.white',
            backgroundColor: 'action.disabledBackground',
            zIndex: theme => theme.zIndex.mobileStepper - 1
          }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Grid>
      <Grid container spacing={3} sx={{ position: 'relative' }}>
        <Grid item sx={{ mt: 3, position: 'relative' }} xs={12} md={12}>
          <Card
            sx={{
              '& .MuiCardHeader-root .MuiCardHeader-title': {
                fontSize: '1.15rem',
                color: 'primary.dark',
                fontWeight: 600
              }
            }}
          >
            <CardHeader
              title={<Translations text={'Leads Chart'} />}
              subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
              action={
                <FormControl fullWidth>
                  <Select value={leadsGraphSelectedOption} onChange={graphDateChangeHandler}>
                    <MenuItem value={'LAST_7_DAYS'}>
                      <Translations text={'Last 7 Days'} />
                    </MenuItem>
                    <MenuItem value={'LAST_14_DAYS'}>
                      <Translations text={'Last 14 Days'} />
                    </MenuItem>
                    <MenuItem value={'LAST_30_DAYS'}>
                      <Translations text={'Last 30 Days'} />
                    </MenuItem>
                    <MenuItem value={'LAST_3_MONTHS'}>
                      <Translations text={'Last 3 Months'} />
                    </MenuItem>
                  </Select>
                </FormControl>
              }
            />
            <CardContent sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
              {isDefined(dashboardLeadGraphResponse?.data) && renderLeadGraph(theme, dashboardLeadGraphResponse?.data)}
            </CardContent>
          </Card>
        </Grid>
        <Backdrop
          open={isDefined(dashboardLeadGraphResponse?.isLoading) ? dashboardLeadGraphResponse?.isLoading : false}
          sx={{
            ml: 3,
            mt: 6,
            borderRadius: 1,
            position: 'absolute',
            color: 'common.white',
            backgroundColor: 'action.disabledBackground',
            zIndex: theme => theme.zIndex.mobileStepper - 1
          }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Grid>
    </>
  )
}

export default Dashboard
