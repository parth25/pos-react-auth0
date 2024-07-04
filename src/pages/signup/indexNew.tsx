// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import PublicLayout from 'src/layouts/PublicLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Styled Components
const SignupIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 480,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const Signup = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const imageSource = skin === 'bordered' ? 'lead-advisor-hero' : 'lead-advisor-hero'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <SignupIllustration alt='register-illustration' src={`/images/${imageSource}.png`} />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <svg
              width={40}
              id='Layer_1'
              data-name='Layer 1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 2220 1667.27'
            >
              <defs>
                <style>{'.cls-1{fill:#ef7124}'}</style>
              </defs>
              <path
                className='cls-1'
                d='M133.72 131.79C59.06 171 23.64 230.4 23.64 316.48c0 65.1 15.3 103.42 60.28 150.32 86.14 90.89 253.68 69.85 318.71-40.24l24.94-43.07h377.09l22 29.68c32.51 43.07 97.62 69.85 152.16 61.28 35.42-4.75 53.63-15.3 87.14-48.81l42.08-42.15h190.49c190.49 0 191.41 0 220.1 23.95 38.32 32.58 106.26 35.42 149.4 6.73 24.87-16.3 49.73-65.11 49.73-98.62 0-60.28-56.46-113.91-119.65-113.91-34.43 0-91 24.87-91 40.24 0 3.83-91.88 7.65-204.73 7.65h-204.8l-15.3-23.94c-53.63-81.4-199.13-83.31-255.59-3.83l-19.13 27.77H611.33c-164.63 0-195.24-1.91-195.24-14.38 0-21-56.53-80.4-96.69-101.44-45.91-23-143.6-24-185.68-1.92'
              />
              <path
                d='M1942.75 631.41c-64.11 16.22-128.29 67-143.59 115.83-5.74 18.2-14.31 19.12-200.05 19.12h-193.33l-21.11-28.69c-59.29-80.4-193.25-80.4-252.62 0l-21.11 28.69H915.71c-194.32 0-195.24 0-224-23.94-40.17-33.51-109.1-33.51-150.26 1a116.75 116.75 0 0 0 0 179.94c41.16 34.43 110.09 34.43 150.26 1 28.76-24 29.68-24 224-24h195.23l21.11 28.7c28.69 38.25 72.69 59.36 126.31 59.36s97.62-21.11 126.31-59.36l21.11-28.7h193.33c185.74 0 194.31 1 200.05 19.06 17.21 52.71 88 105.34 160.81 118.73 113.91 21 236.39-86.14 236.39-204.8 0-84.23-66.09-172.29-146.42-196.23-52.64-15.3-63.19-16.22-107.19-5.74'
                style={{
                  fill: '#456eb5'
                }}
              />
              <path
                className='cls-1'
                d='M152.85 1154c-81.33 31.59-129.21 104.35-129.21 196.23 0 87.13 36.34 147.42 112 185.74 43.07 22 137.85 20 183.76-2.9 40.16-21 96.69-80.41 96.69-101.45 0-12.47 30.61-14.38 195.24-14.38h196.23l19.13 27.7c56.46 79.48 202 77.57 255.59-3.75l15.3-24h204.87c112.85 0 204.73 3.83 204.73 7.65 0 15.3 56.53 40.24 91 40.24 46 0 87.14-24.94 105.34-63.19s18.21-62.27.92-102.44c-27.77-67.93-120.64-88-182.84-41.15-32.51 24.86-32.51 24.86-223 24.86h-190.53l-42.07-42.1c-33.51-33.44-51.72-44-87.14-48.74-54.54-8.64-119.65 18.14-152.16 61.21l-22 29.68H427.57l-24.94-43.07c-47.81-80.4-161.73-119.65-249.78-86.14'
              />
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Adventure starts here 🚀
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Make your app management easy and fun!</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
              <CustomTextField autoFocus fullWidth sx={{ mb: 4 }} label='Username' placeholder='johndoe' />
              <CustomTextField fullWidth label='Email' sx={{ mb: 4 }} placeholder='user@email.com' />
              <CustomTextField
                fullWidth
                label='Password'
                id='auth-login-v2-password'
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FormControlLabel
                control={<Checkbox />}
                sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: theme.typography.body2.fontSize } }}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'text.secondary' }}>I agree to</Typography>
                    <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                      privacy policy & terms
                    </Typography>
                  </Box>
                }
              />
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Sign up
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                <Typography component={LinkStyled} href='/login'>
                  Sign in instead
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Signup.getLayout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>

Signup.guestGuard = true

export default Signup
