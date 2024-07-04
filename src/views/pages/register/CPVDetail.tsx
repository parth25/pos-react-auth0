import { LoadingButton } from '@mui/lab'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import { useTheme } from '@mui/material/styles'
import React, { useEffect, useReducer } from 'react'
import { getAllCpv } from 'src/store/app'
import { useTranslation } from 'react-i18next'
import { useApi } from 'src/hooks/useApi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { CommonProcurementVocabulary } from 'src/generated-sources/swagger-api'
import { updateCompanyInfo } from 'src/store/company'
import { CpvEventState, RegisterStepProps } from 'src/types/global'

import { useMediaQuery } from '@mui/material'

import { useSettings } from 'src/@core/hooks/useSettings'
import { createTree, isNonEmpty } from 'src/utils/miscellaneous'
import { useComponentDidUpdate } from 'src/hooks/useComponentDidUpdate'
import { TreeNode } from 'src/types/apps/CheckboxTreeTypes'
import Icon from 'src/@core/components/icon'
import CustomInputField from 'src/layouts/components/CustomInputField'
import Translations from 'src/layouts/components/Translations'
import CheckboxTree from 'src/views/pages/misc/tree/CheckboxTree'

const CPVDetail = (props: RegisterStepProps) => {
  const { i18n } = useTranslation()
  const { backendApi } = useApi()
  const dispatch = useDispatch()

  const appStore = useSelector((state: RootState) => state.app)
  const companyStore = useSelector((state: RootState) => state.company.info)

  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const { settings } = useSettings()
  const { direction } = settings
  const [expanded, setExpanded] = React.useState<string[]>([])
  const [event, updateEvent] = useReducer(
    (prev: CpvEventState, next: Partial<CpvEventState>): CpvEventState => {
      return { ...prev, ...next }
    },
    {
      query: '',
      originalCpvTree: [],
      filteredCpvTree: [],
      userSelectedTreeNodes: []
    }
  )

  const setUserUpdateSelectedTreeNodes = (checked: string[]) => {
    updateEvent({ userSelectedTreeNodes: checked })
  }

  const convertToNode = (rawNodes: CommonProcurementVocabulary[]): TreeNode[] => {
    return rawNodes.map(rawNode => {
      return {
        id: rawNode?.id?.toString(),
        label: rawNode?.name || '',
        value: rawNode?.id?.toString(),
        parentId: rawNode?.parentId?.toString()
      } as TreeNode
    })
  }

  const updateCpvTree = async () => {
    const _ = createTree(convertToNode(appStore.cpv.data.getCpvs()), 'value', 'parentId')
    updateEvent({
      originalCpvTree: _,
      filteredCpvTree: event.query ? event?.filteredCpvTree || _ : _,
      userSelectedTreeNodes: []
    })
  }
  const filterNodes = (filtered: any, node: any) => {
    const children = (node.children || []).reduce(filterNodes, [])

    if (
      // Node's label matches the search string
      node.label?.toLocaleLowerCase().indexOf(event.query.toLocaleLowerCase()) > -1 ||
      // Or a children has a matching node
      children.length
    ) {
      filtered.push({ ...node, children })
    }

    return filtered
  }

  const cpvFormSubmit = () => {
    dispatch(
      updateCompanyInfo({
        backendApi: backendApi,
        languageCode: i18n.language,
        commonProcurementVocabulary: event.userSelectedTreeNodes.map(id => ({ id: Number(id) })),
        name: companyStore.data?.name,
        billingAddress: companyStore.data?.billingAddress,
        city: companyStore.data?.city,
        state: companyStore.data?.state,
        taxNumber: companyStore.data?.taxNumber,
        currency: companyStore.data?.currency,
        portalCountries: companyStore.data?.portalCountries
      })
    )
  }

  useComponentDidUpdate(() => {
    if (!isNonEmpty(event.query)) {
      updateEvent({
        filteredCpvTree: event?.originalCpvTree
      })
    } else {
      updateEvent({
        filteredCpvTree: event?.originalCpvTree.reduce(filterNodes, [])
      })
    }
  }, [event.query])
  useEffect(() => {
    updateCpvTree()
  }, [appStore.cpv])

  useEffect(() => {
    dispatch(getAllCpv({ backendApi: backendApi, languageCode: i18n.language }))
  }, [])

  return (
    <CardContent sx={{ position: 'relative' }}>
      <CustomInputField
        fullWidth
        type={'search'}
        size={'medium'}
        value={event.query}
        sx={{ py: 0.5 }}
        placeholder='Search the Markets nomenclature'
        onChange={event => updateEvent({ query: event.target.value })}
        startAdornment={
          <InputAdornment position='start' sx={{ color: 'text.disabled' }}>
            <Icon icon='tabler:search' fontSize='1.375rem' />
          </InputAdornment>
        }
      />

        <Grid container spacing={4} sx={{ height: 'calc(100vh - 20rem)', px: 4, py: 2.16, mt: 1 }}>
          {event?.filteredCpvTree ? (
            <CheckboxTree
              nodes={event.filteredCpvTree}
              setChecked={setUserUpdateSelectedTreeNodes}
              setExpanded={setExpanded}
              expanded={expanded}
              checked={event.userSelectedTreeNodes}
              direction={direction}
            />
          ) : (
            <Box />
          )}
        </Grid>

      <Backdrop
        open={appStore.cpv.isLoading}
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
        <Button
          size='large'
          variant='outlined'
          color='secondary'
          onClick={() => props.setActiveStep(props.activeStep - 1)}
        >
          <Translations text={'Back'} />
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            sx={{ mr: 4 }}
            size='large'
            type='button'
            variant='outlined'
            onClick={() => dispatch({ type: 'Company/fakeRegistration', payload: false })}
          >
            <Translations text={'Skip'} />
          </Button>
          <LoadingButton
            size='large'
            type='submit'
            onClick={() => cpvFormSubmit()}
            loading={companyStore.isLoading}
            variant='contained'
          >
            <Box component={'span'}>
              <Translations text={'Submit'} />
            </Box>
          </LoadingButton>
        </Box>
      </Box>
    </CardContent>
  )
}

export default CPVDetail
