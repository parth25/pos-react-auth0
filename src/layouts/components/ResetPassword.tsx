import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, OutlinedInput } from '@mui/material'
import Translations from 'src/layouts/components/Translations'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'

import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import { useDispatch } from 'react-redux'

import toast from 'react-hot-toast'
import { ResetPasswordProps } from 'src/types/global'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { Icon } from '@iconify/react'
import { UserChangePasswordRequest } from 'src/generated-sources/swagger-api'
import { LoadingButton } from '@mui/lab'
import Box from '@mui/material/Box'
import { changeUserPassword } from 'src/store/user'

interface State {
  showNewPassword: boolean
}

const defaultValues = {
  newPassword: ''
}

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, () => <Translations text={'Password must be at least 8 characters'} />)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, () => (
      <Translations
        text={'Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character'}
      />
    ))
    .required()
})

const ResetPassword = ({ backendApi, openDialog, handleCloseDialog, user, isLoading }: ResetPasswordProps) => {
  const dispatch = useDispatch()
  const [values, setValues] = useState<State>({
    showNewPassword: false
  })

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, resolver: yupResolver(schema) })

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleSubmitChangePassword = async (data: UserChangePasswordRequest) => {
    const response = await dispatch(
      changeUserPassword({
        backendApi: backendApi,
        userChangePasswordRequest: {
          email: user?.email,
          newPassword: data?.newPassword,
          connection: 'Username-Password-Authentication'
        }
      })
    )
    if (response?.meta?.requestStatus === 'fulfilled') {
      toast.success(<Translations text={'Password Changed Successfully'} />, { duration: 2000 })
      handleCloseDialog()
    } else {
      toast.error(<Translations text={'Something Went Wrong'} />, { duration: 2000 })
      handleCloseDialog()
    }
    reset(defaultValues)
  }

  return (
    <Dialog
      maxWidth={'xs'}
      fullWidth={true}
      open={openDialog}
      onClose={() => {
        handleCloseDialog()
        reset(defaultValues)
      }}
    >
      <DialogTitle>
        <Translations text={'Change Password'} />
      </DialogTitle>
      <DialogContent sx={{ padding: '5 !important' }}>
        <form onSubmit={handleSubmit(handleSubmitChangePassword)}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='input-new-password' error={Boolean(errors.newPassword)}>
                  <Translations text={'New Password'} />
                </InputLabel>
                <Controller
                  name='newPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label={<Translations text={'New Password'} />}
                      onChange={onChange}
                      id='input-new-password'
                      error={Boolean(errors.newPassword)}
                      type={values.showNewPassword ? 'text' : 'password'}
                      autoFocus={true}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <Icon icon={values.showNewPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.newPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button
                type='reset'
                variant='outlined'
                color='secondary'
                size='small'
                sx={{ mr: 4 }}
                onClick={() => {
                  handleCloseDialog()
                  reset(defaultValues)
                }}
              >
                <Translations text={'Cancel'} />
              </Button>
              <LoadingButton
                size='small'
                type='submit'
                loading={isLoading}
                loadingIndicator={<Translations text={'Saving...'} />}
                variant='contained'
              >
                <Box component={'span'}>
                  <Translations text={'Save'} />
                </Box>
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPassword
