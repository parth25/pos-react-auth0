// ** React Imports
import Tooltip from '@mui/material/Tooltip'
import React, { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled, useTheme } from '@mui/material/styles'
import Drawer from '@mui/material/Drawer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'
import { ContentUploaderProps } from 'src/types/global'
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import Grid from '@mui/material/Grid'
import Backdrop from '@mui/material/Backdrop'
import { CircularProgressWithLabel } from 'src/layouts/components/CircularProgressWithLabel'
import { formatByteValue, isNonEmpty } from 'src/utils/miscellaneous'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Asset, DocumentType, Lead, Service } from 'src/generated-sources/swagger-api'
import { useDispatch } from 'react-redux'
import { contentUpload } from 'src/store/content'
import { AxiosProgressEvent } from 'axios'
import Autocomplete from '@mui/material/Autocomplete'
import Translations from 'src/layouts/components/Translations'
import CustomTextField from 'src/layouts/components/CustomTextField'
import { useComponentDidUpdate } from 'src/hooks/useComponentDidUpdate'

// Styled component for the upload image inside the dropzone area
export const Img = styled('img')(({ theme }) => ({
  width: 48,
  height: 48,
  marginBottom: theme.spacing(8.5)
}))

const ContentUploader = ({
  languageCode,
  backendApi,
  title,
  basePath,
  isShowed,
  setIsShowed,
  leads,
  selectedLeads,
  selectedProducts,
  products,
  services,
  selectedServices,
  selectedCompanyCountry
}: ContentUploaderProps) => {
  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [fileUploadCounter, setFileUploadCounter] = useState<number>(0)
  const [overwrite, setOverwrite] = useState<boolean>(true)
  const [canProcess, setCanProcess] = useState<boolean>(false)

  const [userSelectedLeadsForDocument, setUserSelectedLeadsForDocument] = useState<Array<Lead>>(selectedLeads || [])
  const [userSelectedProductsForDocument, setUserSelectedProductsForDocument] = useState<Array<Asset>>(
    selectedProducts || []
  )
  const [userSelectedServicesForDocument, setUserSelectedServicesForDocument] = useState<Array<Service>>(
    selectedServices || []
  )
  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch()
  const maxSize = 104857600 // 100 MB

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: maxSize,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.tif', '.tiff', '.webp'],
      'application/zip': ['.zip'],
      'application/pdf': ['.pdf'],
      'application/xml': ['.xml'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.visio': ['.vsd'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: (fileRejections: FileRejection[], event: DropEvent) => {
      fileRejections.forEach(file => {
        for (const err of file.errors) {
          if (err.code === 'file-invalid-type') {
            toast.error(<Translations text={'Invalid file type.'} />, {
              duration: 2000
            })
            break
          }
          if (err.code === 'file-too-large') {
            toast.error(
              <>
                <Translations text={'File size should not exceed'} />
                {` ${formatByteValue(maxSize)}.`}
              </>,
              {
                duration: 2000
              }
            )
            break
          }
        }
      })
    }
  })

  const onFileSubmit = async () => {
    dispatch(
      contentUpload({
        backendApi: backendApi,
        languageCode: languageCode,
        basePath: basePath,
        file: files[0],
        leads: userSelectedLeadsForDocument?.map(lead => ({ id: lead.id })),
        assets: userSelectedProductsForDocument?.map(asset => ({ id: asset.id })),
        services: userSelectedServicesForDocument?.map(service => ({ id: service.id })),
        documentType: DocumentType.Company,
        process: canProcess,
        name: files[0].name,
        overwrite: overwrite,
        options: {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            setFileUploadCounter((progressEvent?.progress ?? 0) * 100)
          }
        }
      })
    )
  }

  useComponentDidUpdate(() => {
    if (fileUploadCounter == 100) {
      toast.success(<Translations text={'File uploaded successfully!'} />, { duration: 2000 })
      setFiles([])
      setFileUploadCounter(0)
    }
  }, [fileUploadCounter])

  const toggleDrawer = (isOpen: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setIsShowed(isOpen)
  }

  const Header = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
  }))

  const handleUserSelectedLeadsChangedForDocument = (event: any, value: Array<Lead>) => {
    setUserSelectedLeadsForDocument(value)
  }
  const handleUserSelectedProductsChangedForDocument = (event: any, value: Array<Asset>) => {
    setUserSelectedProductsForDocument(value)
  }
  const handleUserSelectedServicesChangedForDocument = (event: any, value: Array<Service>) => {
    setUserSelectedServicesForDocument(value)
  }

  return (
    <Drawer
      variant='temporary'
      anchor='right'
      open={isShowed}
      ModalProps={{ keepMounted: true }}
      onClose={toggleDrawer(false)}
    >
      <Header>
        <Typography variant='h6'>{title}</Typography>
        <IconButton
          size='small'
          onClick={toggleDrawer(false)}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <Grid container direction='column' spacing={4}>
          <Grid item>
            <DropzoneWrapper sx={{ width: '25.313rem' }}>
              <Fragment>
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Img alt='Upload img' src={`/images/misc/upload-${theme.palette.mode}.png`} />
                    {files.length > 0 ? (
                      <Fragment>
                        <Tooltip title={files.map((file: File) => file.name).join('')}>
                          <Box sx={{ display: 'grid' }}>
                            <Box
                              component='span'
                              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                            >
                              {files.map((file: File) => file.name).join('')}
                            </Box>
                          </Box>
                        </Tooltip>
                        <Box component='span'>({files.map((file: File) => formatByteValue(file.size)).join('')})</Box>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Typography variant='h5' sx={{ mb: 2.5 }}>
                          <Translations text={'Drop files here or click to upload.'} />
                        </Typography>
                        <Typography variant='h6' sx={{ mb: 2.5 }}>
                          <Translations text={'(Maximum file size: '} />
                          <Translations text={`${formatByteValue(maxSize)})`} />
                        </Typography>
                      </Fragment>
                    )}
                  </Box>
                </div>
              </Fragment>
            </DropzoneWrapper>
          </Grid>
          <Grid item>
            <Autocomplete
              multiple
              size='small'
              sx={{ mt: 3, width: '25.313rem' }}
              value={userSelectedLeadsForDocument}
              options={leads || []}
              getOptionLabel={option => option.name as string}
              onChange={handleUserSelectedLeadsChangedForDocument}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<Translations text={'Assign Leads'} />}
                  placeholder={'Select leads to be assigned'}
                />
              )}
              noOptionsText={<Translations text={'No data found!'} />}
            />
          </Grid>
          <Grid item>
            <Autocomplete
              multiple
              size='small'
              sx={{ mt: 3, width: '25.313rem' }}
              value={userSelectedProductsForDocument}
              options={products || []}
              getOptionLabel={(option: Asset) => option?.name}
              onChange={handleUserSelectedProductsChangedForDocument}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<Translations text={'Assign Products'} />}
                  placeholder={'Select products to be assigned'}
                />
              )}
              noOptionsText={<Translations text={'No data found!'} />}
            />
          </Grid>
          <Grid item>
            <Autocomplete
              multiple
              size='small'
              sx={{ mt: 3, width: '25.313rem' }}
              value={userSelectedServicesForDocument}
              options={services || []}
              getOptionLabel={(option: Service) => option?.name}
              onChange={handleUserSelectedServicesChangedForDocument}
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label={<Translations text={'Assign Services'} />}
                  placeholder={'Select services to be assigned'}
                />
              )}
              noOptionsText={<Translations text={'No data found!'} />}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={overwrite}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setOverwrite(event.target.checked)
                  }}
                />
              }
              label={<Translations text={'Overwrite existing file?'} />}
            />
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: theme => theme.spacing(4) }}>
              <Button onClick={onFileSubmit} disabled={!isNonEmpty(files)} variant='contained'>
                <Translations text={'Submit'} />
              </Button>
              <Button variant='outlined' color='secondary' onClick={toggleDrawer(false)}>
                <Translations text={'Cancel'} />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Backdrop
        open={![0, 100].includes(fileUploadCounter)}
        sx={{
          position: 'absolute',
          color: 'common.white',
          backgroundColor: 'action.disabledBackground',
          zIndex: theme => theme.zIndex.mobileStepper - 1
        }}
      >
        <CircularProgressWithLabel value={fileUploadCounter} color='primary' />
      </Backdrop>
    </Drawer>
  )
}

export default ContentUploader
