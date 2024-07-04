import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'

import React from 'react'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'

import { ImagePreviewDialogProps } from 'src/types/global'
import ImageSlider from './ImageSlider'

const ImagePreviewDialog = ({
  openImagePreviewDialog,
  handleImagePreviewDialog,
  selectedImagePreview,
  initialSelectedImageIndex
}: ImagePreviewDialogProps) => {
  const { settings } = useSettings()

  return (
    <Dialog maxWidth={'lg'} fullWidth open={openImagePreviewDialog} onClose={handleImagePreviewDialog}>
      <DialogTitle sx={{ padding: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            padding: 4
          }}
        >
          <IconButton
            size='small'
            edge='end'
            color='inherit'
            onClick={() => handleImagePreviewDialog()}
            aria-label='close'
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </Box>
        <Divider />
      </DialogTitle>
      <DialogContent>
        <ImageSlider
          direction={settings.direction}
          urls={selectedImagePreview.map(img => img)}
          initialIndex={initialSelectedImageIndex}
        />
      </DialogContent>
    </Dialog>
  )
}

export default ImagePreviewDialog
