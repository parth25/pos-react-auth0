// ** React Imports
import { useAuth0 } from '@auth0/auth0-react'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import MuiStep, { StepProps } from '@mui/material/Step'
import Avatar from '@mui/material/Avatar'
import Box, { BoxProps } from '@mui/material/Box'
import { useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import CompanyDetails from 'src/views/pages/register/CompanyDetails'
import CPVDetail from 'src/views/pages/register/CPVDetail'
import UserDetails from 'src/views/pages/register/UserDetails'
import { isNonEmpty } from 'src/utils/miscellaneous'
import { RootState } from 'src/store'
import PortalsSelections from 'src/views/pages/register/PortalsSelections'
import Translations from 'src/layouts/components/Translations'
import appConfig from 'src/configs/appConfig'
import { useAuth } from 'src/hooks/useAuth'

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  '&:first-of-type': {
    paddingLeft: 0
  },
  '&:last-of-type': {
    paddingRight: 0
  },
  '& .MuiStepLabel-iconContainer': {
    display: 'none'
  },
  '& .step-subtitle': {
    color: `${theme.palette.text.disabled} !important`
  },
  '& + svg': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed .step-title': {
    color: theme.palette.text.disabled
  },
  '&.Mui-completed + svg': {
    color: theme.palette.primary.main
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 950
  },
  [theme.breakpoints.up('lg')]: {
    width: 1100
  },
  [theme.breakpoints.up('xl')]: {
    width: 1250
  }
}))

const Register = () => {
  const router = useRouter()
  const userProfile = useSelector((state: RootState) => state.user.profile.data)
  const companyInfo = useSelector((state: RootState) => state.company.info.data)
  const [activeStep, setActiveStep] = useState<number>(0)
  const auth = useAuth()

  const companyDetailsPage = {
    icon: 'tabler:home',
    title: <Translations text={'Company details'} />,
    component: (activeStep: number, setActiveStep: React.Dispatch<React.SetStateAction<number>>) => (
      <CompanyDetails activeStep={activeStep} setActiveStep={setActiveStep} />
    )
  }

  const userDetailsPage = {
    icon: 'tabler:user',
    title: <Translations text={'User details'} />,
    component: (activeStep: number, setActiveStep: React.Dispatch<React.SetStateAction<number>>) => (
      <UserDetails activeStep={activeStep} setActiveStep={setActiveStep} />
    )
  }

  const portalsSelectionsPage = {
    icon: 'tabler:world-www',
    title: <Translations text={'Choose markets'} />,
    component: (activeStep: number, setActiveStep: React.Dispatch<React.SetStateAction<number>>) => (
      <PortalsSelections activeStep={activeStep} setActiveStep={setActiveStep} />
    )
  }

  // const commonProcurementVocabularyPage = {
  //   icon: 'carbon:industry',
  //   title: <Translations text={'Common procurement vocabulary'} />,
  //   component: (activeStep: number, setActiveStep: React.Dispatch<React.SetStateAction<number>>) => (
  //     <CPVDetail activeStep={activeStep} setActiveStep={setActiveStep} />
  //   )
  // }

  const companyRegisterSteps = [
    companyDetailsPage,
    userDetailsPage,
    portalsSelectionsPage
    // commonProcurementVocabularyPage
  ]
  const userRegisterSteps = [userDetailsPage, portalsSelectionsPage]
  const portalsSteps = [portalsSelectionsPage]

  const finalStepsRef = useRef([] as any)

  if (!isNonEmpty(finalStepsRef.current)) {
    finalStepsRef.current =
      userProfile?.isRegistrationRequired && isNonEmpty(companyInfo)
        ? userRegisterSteps
        : isNonEmpty(!userProfile?.leadPortals) && !userProfile?.isRegistrationRequired && isNonEmpty(companyInfo)
        ? portalsSteps
        : companyRegisterSteps
  }

  useEffect(() => {
    if (!userProfile?.isRegistrationRequired && isNonEmpty(companyInfo) && isNonEmpty(userProfile?.leadPortals)) {
      auth.getAccessTokenSilently({
        cacheMode: 'off',
        authorizationParams: { scope: appConfig.auth.SCOPE.split(',').join(' ') }
      })
      router.push('/dashboard/statistics')
    }
  }, [userProfile, companyInfo])

  return (
    <Box className='content-center'>
      <RightWrapper>
        <Card>
          <CardContent>
            <StepperWrapper>
              <Stepper activeStep={activeStep}>
                {finalStepsRef.current.map((step: any, index: number) => {
                  const RenderAvatar = activeStep >= index ? CustomAvatar : Avatar

                  return (
                    <Step key={index}>
                      <StepLabel StepIconComponent={StepperCustomDot}>
                        <div className='step-label'>
                          <RenderAvatar
                            variant='rounded'
                            {...(activeStep >= index && { skin: 'light' })}
                            {...(activeStep === index && { skin: 'filled' })}
                            {...(activeStep >= index && { color: 'primary' })}
                            sx={{
                              ...(activeStep === index && { boxShadow: theme => theme.shadows[3] }),
                              ...(activeStep > index && {
                                color: theme => hexToRGBA(theme.palette.primary.main, 0.4)
                              })
                            }}
                          >
                            <Icon icon={step.icon} />
                          </RenderAvatar>

                          <Typography className='step-title'>{step.title}</Typography>
                        </div>
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
            </StepperWrapper>
          </CardContent>

          <Divider />
          {finalStepsRef.current.length === 0 ? (
            <div>Loading...</div> // Handle loading state if needed
          ) : (
            finalStepsRef.current[activeStep].component(activeStep, setActiveStep)
          )}
        </Card>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default Register
