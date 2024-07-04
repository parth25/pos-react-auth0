import { LoadingButton } from '@mui/lab'
import Autocomplete from '@mui/material/Autocomplete'
import React, {ElementType, useEffect, useState} from 'react'
import { CompanyRegisterFormType, RegisterStepProps } from 'src/types/global'
import { CompanyCountry, PortalCountry } from 'src/generated-sources/swagger-api'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import { yupResolver } from '@hookform/resolvers/yup'
import { getAllCurrencies, getAllPortalCountries } from 'src/store/app'
import { useTranslation } from 'react-i18next'
import { useApi } from 'src/hooks/useApi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import * as yup from 'yup'
import { companyRegisterPost, updatePartiallyCompanyInfo } from 'src/store/company'
import Translations from 'src/layouts/components/Translations'
import {Alert, ButtonProps, CardContent} from '@mui/material'


import CustomBadge from 'src/@core/components/mui/badge'

import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/layouts/components/CustomTextField'

import { urlRegExp } from 'src/constants/regularExpression'
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";

export const unassignedOption = {
  id: -1,
  avatar: '/images/avatars/unassign-icon.png',
  firstName: 'Unassigned',
  lastName: ''
}

export const PortalCountrySchema = yup
  .object()
  .nonNullable()
  .shape({
    id: yup.string().required(() => <Translations text={'Country is required'} />)
  })

export const CompanyCountrySchema = yup.object().shape({
  portalCountry: PortalCountrySchema.required(() => <Translations text={'Country is required'} />),
  baseUrl: yup
    .string()
    .required(() => <Translations text={'Please provide the base URL'} />)
    .matches(urlRegExp, () => <Translations text={'Enter correct base URL!'} />)
})

export const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

export const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(
  ({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  })
)

const companyFormSchema = yup.object().shape({
  companyName: yup.string().required(() => <Translations text={'Company name is required'} />),
  billingAddress: yup.string().nullable(),
  taxNumber: yup.string().nullable(),
  companyCity: yup.string().nullable(),
  companyState: yup.string().nullable(),
  companyZipcode: yup.string().nullable(),
  selectedCompanyCountries: yup.object().shape({
    portalCountry: PortalCountrySchema.required(() => <Translations text={'Country is required'} />),
    baseUrl: yup
      .string()
      .required(() => <Translations text={'Please provide the company website'} />)
      .matches(urlRegExp, () => <Translations text={'Enter the correct company website'} />)
  }),
  logo: yup.mixed().test(
    'fileSize',
    () => <Translations text={'Image size is too large (max 500KB)'} />,
    value => {
      if (!value || !(value instanceof File)) {
        // Invalid or missing file
        return true
      }

      return value.size <= 500 * 1024 // 500 KB in bytes
    }
  )
})

const CompanyDetails = (props: RegisterStepProps) => {
  const { i18n } = useTranslation()
  const { backendApi } = useApi()
  const dispatch = useDispatch()
  const appStore = useSelector((state: RootState) => state.app)
  const companyStore = useSelector((state: RootState) => state.company.info)

  const companyRegisterFormDefault: CompanyRegisterFormType = {
    taxNumber: companyStore?.data?.taxNumber,
    companyName: companyStore?.data?.name || '',
    billingAddress: companyStore?.data?.billingAddress,
    companyCity: companyStore?.data?.city,
    companyZipcode: companyStore?.data?.postalCode,
    companyState: companyStore?.data?.state,
    selectedCompanyCountries: companyStore?.data?.portalCountries?.[0]
      ? companyStore.data.portalCountries[0]
      : ({} as CompanyCountry),
    logo: companyStore?.data?.faviconIcon || unassignedOption?.avatar,
    baseUrls: companyStore?.data?.portalCountries?.map((item: CompanyCountry) => item?.baseUrl) || ['']
  }

  const [companyFormData, setFormData] = useState<CompanyRegisterFormType>(companyRegisterFormDefault)

  const {
    reset: companyFormReset,
    control: companyFormControl,
    handleSubmit: handleCompanySubmit,
    formState: { errors: companyFormErrors },
    watch
  } = useForm({
    defaultValues: companyFormData,
    resolver: yupResolver(companyFormSchema)
  })

  const companyFormSubmit = (companyFormData: any) => {
    dispatch(
      companyRegisterPost({
        backendApi: backendApi,
        languageCode: i18n.language,
        name: companyFormData.companyName,
        billingAddress: companyFormData.billingAddress,
        city: companyFormData.companyCity,
        postalCode: companyFormData.companyZipcode,
        state: companyFormData.companyState,
        taxNumber: companyFormData.taxNumber,
        faviconIcon: companyFormData.logo,
        portalCountries: [companyFormData.selectedCompanyCountries]
      })
    ).then(async (response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        props.setActiveStep(props.activeStep + 1)
      }
    })
  }

  useEffect(() => {
    dispatch(getAllCurrencies({ backendApi: backendApi, languageCode: i18n.language }))
    dispatch(getAllPortalCountries({ backendApi: backendApi, languageCode: i18n.language }))
  }, [])

  return (
    <CardContent>
      <form key={0} onSubmit={handleCompanySubmit(companyFormSubmit)} noValidate>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Alert
              severity='warning'
              icon={<Icon icon='tabler:info-circle' />}
              sx={{
                mb: 4,
                '& .MuiAlert-icon ': { backgroundColor: 'beige' }
              }}
            >
              <Typography>
                {
                  <Translations
                    text={
                      'Please briefly provide some information about your company, as your e-mail does not belong to an organization known to us.'
                    }
                  />
                }
              </Typography>
            </Alert>

            <Box sx={{ border: '1px solid #D2D2D2', borderRadius: 1, position: 'relative' }}>
              <CustomBadge
                style={{ color: '#7A7A7A' }}
                badgeContent={<span style={{ backgroundColor: 'white' }}>{<Translations text={' Logo '} />}</span>}
                sx={{ position: 'absolute', top: 0, left: 30 }}
              />
              <Box sx={{ p: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <ImgStyled
                  src={
                    (watch('logo') as any) instanceof File ? URL.createObjectURL(watch('logo') as any) : watch('logo')
                  }
                  alt='Logo'
                  sx={{ width: 65, height: 65 }}
                />
                <Box>
                  <ButtonStyled
                    size='small'
                    component='label'
                    variant='contained'
                    htmlFor='account-settings-upload-image-faviconIcon'
                  >
                    <Translations text={'Upload logo'} />
                    <Controller
                      name='logo'
                      control={companyFormControl}
                      rules={{ required: true }}
                      render={({ field: { onChange, name } }) => (
                        <>
                          <input
                            name={name}
                            hidden
                            type='file'
                            accept='image/png, image/jpeg, image/svg+xml'
                            id='account-settings-upload-image-faviconIcon'
                            onChange={e => {
                              if (e?.target?.files && e?.target?.files.length > 0) {
                                onChange(e?.target?.files[0])
                              }
                            }}
                          />
                        </>
                      )}
                    />
                  </ButtonStyled>
                  {companyFormErrors.logo ? (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-faviconIcon'>
                      {companyFormErrors.logo.message}
                    </FormHelperText>
                  ) : (
                    <Typography sx={{ mt: 4, color: 'text.disabled', fontSize: 13 }}>
                      {<Translations text={'Allowed PNG or JPEG. Max size of 500KB.'} />}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='companyName'
                control={companyFormControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    required
                    value={value}
                    label={<Translations text={'Company name'} />}
                    onChange={onChange}
                    error={Boolean(companyFormErrors.companyName)}
                    placeholder='Company name'
                    autoFocus={true}
                  />
                )}
              />
              {companyFormErrors.companyName && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-companyName'>
                  {companyFormErrors.companyName.message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name={`selectedCompanyCountries.baseUrl`}
                control={companyFormControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    type='url'
                    label={<Translations text={'Company website'} />}
                    placeholder='Company website in format example.com'
                    value={value}
                    onChange={onChange}
                    error={Boolean(companyFormErrors?.selectedCompanyCountries?.baseUrl)}
                  />
                )}
              />
            </FormControl>
            {companyFormErrors.selectedCompanyCountries && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {companyFormErrors.selectedCompanyCountries?.baseUrl?.message}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='billingAddress'
                control={companyFormControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label={<Translations text={'Billing address'} />}
                    onChange={onChange}
                    placeholder='Billing address'
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='taxNumber'
                control={companyFormControl}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label={<Translations text={'VAT No. (if applicable)'} />}
                    onChange={onChange}
                    placeholder='VAT No. (if applicable)'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='companyZipcode'
                control={companyFormControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label={<Translations text={'Zipcode'} />}
                    onChange={onChange}
                    error={Boolean(companyFormErrors.companyZipcode)}
                    placeholder='Zipcode'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='companyCity'
                control={companyFormControl}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label={<Translations text={'City'} />}
                    onChange={onChange}
                    error={Boolean(companyFormErrors.companyCity)}
                    placeholder='City'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='companyState'
                control={companyFormControl}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    value={value}
                    label={<Translations text={'State'} />}
                    onChange={onChange}
                    placeholder='State'
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Box sx={{ flex: 1, width: { xs: '100%' } }}>
                <Controller
                  name={`selectedCompanyCountries.portalCountry`}
                  control={companyFormControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      fullWidth
                      options={appStore.portalCountries.data
                        ?.slice()
                        .sort((a, b) => a.displayName.localeCompare(b.displayName))}
                      value={value || {}}
                      isOptionEqualToValue={(option: PortalCountry, value: PortalCountry) => option?.id === value?.id}
                      onChange={(event, newValue) => {
                        onChange(newValue)
                      }}
                      getOptionLabel={option => option?.displayName || ''}
                      renderOption={(props, option) => (
                        <Box component='li' sx={{ '& > svg': { mr: 1, flexShrink: 0 } }} {...props}>
                          <Icon icon={option?.icon} /> {option?.displayName}
                        </Box>
                      )}
                      renderInput={params => (
                        <TextField
                          required
                          {...params}
                          variant='outlined'
                          label={<React.Fragment>{<Translations text={'Country'} />}</React.Fragment>}
                          error={Boolean(companyFormErrors?.selectedCompanyCountries?.portalCountry)}
                        />
                      )}
                      noOptionsText={<Translations text={'No data found!'} />}
                    />
                  )}
                />

                {companyFormErrors.selectedCompanyCountries && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {companyFormErrors.selectedCompanyCountries?.portalCountry?.message
                      ? companyFormErrors.selectedCompanyCountries?.portalCountry?.message
                      : companyFormErrors.selectedCompanyCountries?.portalCountry?.id?.message}
                  </FormHelperText>
                )}
              </Box>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton size='large' type='submit' loading={companyStore.isLoading} variant='contained'>
              <Box component={'span'}>
                <Translations text={'Next'} />
              </Box>
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default CompanyDetails
