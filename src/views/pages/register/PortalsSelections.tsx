import { LoadingButton } from '@mui/lab'
import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import { CardContent, useMediaQuery } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import {CompanyLeadPortal, LeadPortal, LeadPortalType} from 'src/generated-sources/swagger-api'
import { useApi } from 'src/hooks/useApi'

import Translations from 'src/layouts/components/Translations'

import { RootState } from 'src/store'
import { getAllCompanyLeadPortals } from 'src/store/app'
import { putUserLeadPortals } from 'src/store/user'
import { RegisterStepProps } from 'src/types/global'
import { isNonEmpty } from 'src/utils/miscellaneous'

export const TypeToColor: Record<LeadPortalType, string> = {
  [LeadPortalType.Private]: 'warning.600',
  [LeadPortalType.Public]: 'success.600',
  [LeadPortalType.Paid]: 'error.600'
}

export const TypeToIcon: Record<LeadPortalType, string> = {
  [LeadPortalType.Private]: 'tabler:lock',
  [LeadPortalType.Public]: 'tabler:lock-open',
  [LeadPortalType.Paid]: 'tabler:credit-card'
}

export function getTypeIcon(status: LeadPortalType) {
  return TypeToIcon[status]
}

export function getTypeColor(status: LeadPortalType) {
  return TypeToColor[status]
}

const PortalsSelections = (props: RegisterStepProps) => {
  const theme = useTheme()
  const { backendApi } = useApi()
  const dispatch = useDispatch()
  const { i18n } = useTranslation()
  const router = useRouter()

  const appStore = useSelector((state: RootState) => state.app)
  const userStore = useSelector((state: RootState) => state.user.profile)

  const companyInfo = useSelector((state: RootState) => state.company.info.data)
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const [expandedCountry, setExpandedCountry] = useState<string[]>([])
  const [checkedPortal, setCheckedPortal] = useState<LeadPortal[]>([])

  const individualCheckBoxChange = (node: LeadPortal) => () => {
    const nodeIndex = checkedPortal.findIndex(item => item.id === node.id)
    if (nodeIndex !== -1) {
      setCheckedPortal(prevChecked => prevChecked.filter((item, index) => index !== nodeIndex))
    } else {
      setCheckedPortal(prevChecked => [...prevChecked, node])
    }
  }

  const renderTree = (leadPortals: CompanyLeadPortal[]) => {
    const countryMap: { [key: string]: LeadPortal[] } = {}

    // Group nodes by unique parent countries
    leadPortals.forEach((node: CompanyLeadPortal) => {
      if (node.leadPortal.leadCountry && node.leadPortal.leadCountry.displayName) {
        if (!countryMap[node.leadPortal.leadCountry.displayName]) {
          countryMap[node.leadPortal.leadCountry.displayName] = []
        }
        countryMap[node.leadPortal.leadCountry.displayName].push(node.leadPortal)
      }
    })

    return Object.entries(countryMap).map(([country, nodes]: [string, LeadPortal[]]) => {
      // Sort nodes within each country alphabetically
      const sortedNodes = nodes.sort((nodeA, nodeB) => {
        return nodeA.name.localeCompare(nodeB.name)
      })

      const allChildChecked = sortedNodes.every(node => checkedPortal.some(item => item.id === node.id))
      const someChildChecked = sortedNodes.some(node => checkedPortal.some(item => item.id === node.id))

      return (
        <TreeItem
          key={country}
          nodeId={country}
          label={
            <FormControlLabel
              control={
                <Checkbox
                  checked={allChildChecked}
                  onChange={() => handleToggleCountry(sortedNodes)}
                  onClick={e => e.stopPropagation()}
                  indeterminate={!allChildChecked && someChildChecked}
                />
              }
              label={<>{country}</>}
              key={country}
            />
          }
        >
          {sortedNodes.map((node: LeadPortal) => (
            <TreeItem
              key={node.id}
              nodeId={node?.id.toString()}
              label={
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkedPortal.some(item => item.id === node.id)}
                      onChange={individualCheckBoxChange(node)}
                      onClick={e => e.stopPropagation()}
                    />
                  }
                  label={
                    <Tooltip title={node?.fullName}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box component={'span'}>{node.name}</Box>
                        <Box sx={{ '& svg': { color: getTypeColor(node.type) }, display: 'flex', ml: 1 }}>
                          <Icon icon={getTypeIcon(node.type)} fontSize={'medium'} />
                        </Box>
                      </Box>
                    </Tooltip>
                  }
                  key={node.id}
                />
              }
            />
          ))}
        </TreeItem>
      )
    })
  }

  const handleToggleCountry = (nodes: LeadPortal[]) => {
    const parentChecked = nodes.every(node => checkedPortal.some(item => item.id === node.id))

    if (parentChecked) {
      setCheckedPortal(prevChecked => prevChecked.filter(item => !nodes.some(node => node.id === item.id)))
    } else {
      setCheckedPortal(prevChecked => [...new Set([...prevChecked, ...nodes])])
    }
  }

  const handleOnSavePortals = () => {
    dispatch(
      putUserLeadPortals({
        backendApi: backendApi,
        languageCode: i18n.language,
        leadPortals: checkedPortal
      })
    ).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        // companyInfo?.isRegistrationRequired && props.setActiveStep(props.activeStep + 1)
      }
    })
  }

  useEffect(() => {
    setCheckedPortal(userStore?.data?.leadPortals ?? [])
  }, [userStore?.data?.leadPortals])

  useEffect(() => {
    dispatch(getAllCompanyLeadPortals({ backendApi: backendApi, languageCode: i18n.language }))
  }, [])

  return (
    <CardContent sx={{ position: 'relative' }}>

        <TreeView
          sx={{ height: 'calc(100vh - 15rem)' }}
          defaultCollapseIcon={<Icon icon='tabler:chevron-down' />}
          defaultExpandIcon={<Icon icon='tabler:chevron-right' />}
          expanded={expandedCountry}
          onNodeToggle={(_, nodes) => setExpandedCountry(nodes)}
        >
          {renderTree(appStore?.leadPortals?.data)}
        </TreeView>
        <Backdrop
          open={appStore.leadPortals.isLoading}
          sx={{
            position: 'absolute',
            color: 'common.white',
            backgroundColor: 'action.disabledBackground',
            zIndex: theme => theme.zIndex.mobileStepper - 1
          }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {props.activeStep != 0 && (
          <Button
            sx={{ marginRight: 'auto' }} // Change here
            size='large'
            variant='outlined'
            color='secondary'
            onClick={() => props.setActiveStep(props.activeStep - 1)}
          >
            <Translations text={'Back'} />
          </Button>
        )}
        <LoadingButton
          sx={{ marginLeft: 'auto' }} // And here
          size='large'
          type='submit'
          loading={userStore.isLoading}
          variant='contained'
          onClick={() => handleOnSavePortals()}
          disabled={!isNonEmpty(checkedPortal)}
        >
          <Box component={'span'}>
            {/*{props.activeStep == 2 ? <Translations text={'Next'} /> : <Translations text={'Submit'} />}   The condition mentioned should be applied only when displaying the "CPV" tab.*/}
            <Translations text={'Submit'} />
          </Box>
        </LoadingButton>
      </Box>
    </CardContent>
  )
}

export default PortalsSelections
