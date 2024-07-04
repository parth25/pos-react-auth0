import React, { Fragment } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { DialogContentText } from '@mui/material'
import Typography from '@mui/material/Typography'
import Translations from './Translations'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { ConfirmationDialogProps } from 'src/types/global'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { LoadingButton } from '@mui/lab'

function ConfirmationDialog({
  isOpenDialog,
  handleCloseDialog,
  handleAcceptDialog,
  handleRejectDialog,
  dialogIcon,
  mainHeading,
  subHeading,
  acceptButtonLabel,
  rejectButtonLabel,
  isAcceptButtonLoading,
  subHeadingName
}: ConfirmationDialogProps) {
  return (
    <Fragment>
      <Dialog
        maxWidth={'xs'}
        open={isOpenDialog}
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseDialog()
          }
        }}
      >
        <DialogContent>
          <DialogContentText>
            <Grid container sx={{ textAlign: 'center', marginBottom: 5, marginTop: 5 }}>
              <Grid lg={12} xs={12} md={12} xl={12} item mb={5}>
                <Box>{dialogIcon}</Box>
              </Grid>
              <Grid lg={12} xs={12} md={12} xl={12} item>
                <Typography variant='h2'>
                  <Translations text={mainHeading} />
                </Typography>
              </Grid>
              <Grid lg={12} xs={12} md={12} xl={12} item>
                <Typography variant='h6'>
                  <Translations text={subHeading} />
                  {subHeadingName}
                </Typography>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <LoadingButton loading={isAcceptButtonLoading} variant='contained' onClick={() => handleAcceptDialog()}>
            <Translations text={acceptButtonLabel} />
          </LoadingButton>
          <Button variant='contained' color={'error'} onClick={() => handleRejectDialog()}>
            <Translations text={rejectButtonLabel} />
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default ConfirmationDialog
