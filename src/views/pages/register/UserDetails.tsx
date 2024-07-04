import { LoadingButton } from '@mui/lab'
import CircularProgress from '@mui/material/CircularProgress'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useApi } from 'src/hooks/useApi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { RegisterStepProps, userRegisterFormType } from 'src/types/global'
import { CompanyCountry } from 'src/generated-sources/swagger-api'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Autocomplete from '@mui/material/Autocomplete'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import Button from '@mui/material/Button'
import * as yup from 'yup'
import { userProfileSave } from 'src/store/user'
import Translations from 'src/layouts/components/Translations'
import { CardContent } from '@mui/material'
import { putUserSettingsPersonal } from 'src/store/settings'
import { isNonEmpty } from 'src/utils/miscellaneous'
import CustomTextField from 'src/layouts/components/CustomTextField'

const userFormSchema = yup.object().shape({
  userEmail: yup
    .string()
    .email()
    .required(() => <Translations text={'Email is required'} />),
  userLastName: yup.string().required(() => <Translations text={'Last name is required'} />),
  userFirstName: yup.string().required(() => <Translations text={'First name is required'} />),
  defaultCountry: yup.object().required(() => <Translations text={'Default country is required'} />)
})

const UserDetails = (props: RegisterStepProps) => {
  const { i18n } = useTranslation()
  const { backendApi } = useApi()
  const dispatch = useDispatch()

  const userStore = useSelector((state: RootState) => state.user.profile)
  const settingStore = useSelector((state: RootState) => state.settings)
  const companyInfo = useSelector((state: RootState) => state.company.info.data)

  const userRegisterFormDefault: userRegisterFormType = {
    userEmail: userStore.data?.email as string,
    userLastName: userStore.data?.lastName || '',
    userFirstName: userStore.data?.firstName || '',
    defaultCountry: isNonEmpty(settingStore?.user?.data?.PORTAL_COUNTRY)
      ? settingStore?.user?.data?.PORTAL_COUNTRY
      : (companyInfo?.portalCountries as CompanyCountry[])[0]
  }

  const {
    control: userFormControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userFormErrors }
  } = useForm({
    defaultValues: userRegisterFormDefault,
    resolver: yupResolver(userFormSchema)
  })

  const handleChangeDefaultCountry = (changedPortalCountry: any) => {
    dispatch(
      putUserSettingsPersonal({
        backendApi: backendApi,
        settingName: 'PORTAL_COUNTRY',
        settingValue: changedPortalCountry
      })
    )
  }

  useEffect(() => {
    !isNonEmpty(settingStore?.user?.data?.PORTAL_COUNTRY) &&
      handleChangeDefaultCountry((companyInfo?.portalCountries as CompanyCountry[])[0])
  }, [companyInfo?.portalCountries])

  const userFormSubmit = (userFormData: any) => {
    dispatch(
      userProfileSave({
        backendApi: backendApi,
        languageCode: i18n.language,
        firstName: userFormData.userFirstName,
        lastName: userFormData.userLastName,
        leadPortals: userStore?.data?.leadPortals,
        portalCountries: companyInfo.portalCountries,
        isSubscribe: userStore?.data?.isSubscribe,
        language: i18n.language
      })
    ).then((response: any) => {
      if (response.meta.requestStatus === 'fulfilled') {
        props.setActiveStep(props.activeStep + 1)
      }
    })
  }

  return (
    <CardContent>
      <form key={1} onSubmit={handleUserSubmit(userFormSubmit)} noValidate>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <Controller
                name='userEmail'
                control={userFormControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    disabled
                    type='email'
                    value={value}
                    label={<Translations text={'Email'} />}
                    onChange={onChange}
                    error={Boolean(userFormErrors['userEmail'])}
                    placeholder='Email'
                  />
                )}
              />
              {userFormErrors['userEmail'] && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-userEmail'>
                  {userFormErrors['userEmail'].message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='userFirstName'
                control={userFormControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    required
                    value={value}
                    label={<Translations text={'First name'} />}
                    onChange={onChange}
                    placeholder='First name'
                    autoFocus={true}
                    error={Boolean(userFormErrors['userFirstName'])}
                  />
                )}
              />
              {userFormErrors['userFirstName'] && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-userFirstName'>
                  {userFormErrors['userFirstName'].message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name='userLastName'
                control={userFormControl}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    required
                    value={value}
                    label={<Translations text={'Last name'} />}
                    onChange={onChange}
                    placeholder='Last name'
                    error={Boolean(userFormErrors['userLastName'])}
                  />
                )}
              />
              {userFormErrors['userLastName'] && (
                <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-personal-userLastName'>
                  {userFormErrors['userLastName'].message}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='defaultCountry'
              control={userFormControl}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Autocomplete
                  options={companyInfo?.portalCountries as CompanyCountry[]}
                  value={value}
                  loading={settingStore?.user.isLoading}
                  isOptionEqualToValue={(option: CompanyCountry, value: CompanyCountry) => option.id === value.id}
                  onChange={(event, newValue) => {
                    handleChangeDefaultCountry(newValue)
                    onChange(newValue)
                  }}
                  getOptionLabel={option => option?.portalCountry?.displayName}
                  renderOption={(props, option) => (
                    <Box component='li' sx={{ '& > svg': { mr: 1, flexShrink: 0 } }} {...props}>
                      <Icon icon={option?.portalCountry?.icon as string} /> {option?.portalCountry?.displayName}
                    </Box>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <React.Fragment key={option?.portalCountry?.displayName}>
                        <CustomChip
                          sx={{ mr: 2 }}
                          rounded
                          label={
                            <span>
                              <Icon icon={option?.portalCountry?.icon as string} /> {option?.portalCountry?.displayName}
                            </span>
                          } // Include icon and text
                          {...getTagProps({ index })}
                        />
                      </React.Fragment>
                    ))
                  }
                  renderInput={params => (
                    <CustomTextField
                      required
                      {...params}
                      variant='outlined'
                      label={<Translations text={'Default country'} />}
                      placeholder='Default country'
                      error={Boolean(userFormErrors['defaultCountry'])}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {settingStore?.user.isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        )
                      }}
                    />
                  )}
                  noOptionsText={<Translations text={'No data found!'} />}
                />
              )}
            />
            {userFormErrors['defaultCountry'] && (
              <FormHelperText sx={{ color: 'error.main' }}>{userFormErrors['defaultCountry'].message}</FormHelperText>
            )}
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {props.activeStep === 1 && (
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
            >
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

export default UserDetails
