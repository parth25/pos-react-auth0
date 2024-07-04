// ** React Imports
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import { useDispatch } from 'react-redux'

// ** Types Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useApi } from 'src/hooks/useApi'
import CustomTextField from './CustomTextField'
import Translations from './Translations'

// ** Configs Imports

interface Props {
  hidden: boolean
  settings: Settings
  searchOpenDialog: boolean
  handleSearchDialogClose: (value?: ((prevState: boolean) => boolean) | boolean) => void
  handleSearchDialogOpen: (value?: ((prevState: boolean) => boolean) | boolean) => void
  searchVocabularyValue?: string
}

const AutocompleteComponent = ({
  hidden,
  settings,
  searchOpenDialog,
  handleSearchDialogClose,
  handleSearchDialogOpen,
  searchVocabularyValue
}: Props) => {
  // ** States
  const [searchValue, setSearchValue] = useState<string | undefined>(searchVocabularyValue || '')

  // ** Hooks & Vars
  const theme = useTheme()
  const dispatch = useDispatch()
  const { backendApi } = useApi()
  const { layout } = settings
  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!searchOpenDialog) {
      setSearchValue(undefined)
    }
  }, [searchOpenDialog])

  const handleSearchDialogCloseWithReset = () => {
    handleSearchDialogClose()
    dispatch({ type: 'LeadSearch/resetFilter' })
  }
  // Handle key events
  const handleKeyEvent = useCallback(
    (event: KeyboardEvent) => {
      // ** Shortcut keys to open searchbar (Ctrl + /)
      if (!searchOpenDialog && event.type === 'keydown' && event.ctrlKey && event.key === '/') {
        event.preventDefault()
        handleSearchDialogOpen()
      }

      // ** ESC key to close searchbar
      else if (searchOpenDialog && event.type === 'keyup' && event.key === 'Escape') {
        event.preventDefault()
        handleSearchDialogCloseWithReset()
      }
    },
    [searchOpenDialog, handleSearchDialogClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyEvent)
    document.addEventListener('keyup', handleKeyEvent)

    return () => {
      document.removeEventListener('keydown', handleKeyEvent)
      document.removeEventListener('keyup', handleKeyEvent)
    }
  }, [handleKeyEvent])

  return (
    <Box
      ref={wrapper}
      onClick={() => !searchOpenDialog && handleSearchDialogOpen()}
      sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center', flex: 1 }}
    >
      <IconButton color='inherit' sx={!hidden && layout === 'vertical' ? { mr: 0.5, ml: -2.75 } : {}}>
        <Icon fontSize='1.5rem' icon='tabler:search' />
      </IconButton>
      {!hidden && layout === 'vertical' ? (
        <Typography sx={{ userSelect: 'none', color: 'text.disabled' }}>
          <Translations text={`Search (Ctrl+/)`} />
        </Typography>
      ) : null}
      {searchOpenDialog && (
        <Dialog
          maxWidth={false}
          sx={{
            '& .MuiDialog-paper': { overflow: 'hidden', '&:not(.MuiDialog-paperFullScreen)': { height: '100%' } },
            '& .MuiDialogTitle-root': { padding: 0 },
            '& .MuiDialogContent-root': { padding: '0 !important' }
          }}
          fullWidth
          open={searchOpenDialog}
          onClose={() => handleSearchDialogCloseWithReset()}
          disableEscapeKeyDown
        >
          <DialogTitle>
            <CustomTextField
              variant={'standard'}
              fullWidth
              value={searchValue}
              placeholder='Search here'
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
              inputRef={input => {
                if (input) {
                  if (searchOpenDialog) {
                    input.focus()
                  } else {
                    input.blur()
                  }
                }
              }}
              InputProps={{
                sx: {
                  p: `${theme.spacing(3.75, 6)} !important`,
                  '&.Mui-focused': { boxShadow: 0 },
                  '&.MuiInput-root:after': { display: 'none' },
                  '&.MuiInput-root:hover:not(.Mui-disabled):before': {
                    borderBottom: '1px solid rgba(51, 48, 60, 0.22)'
                  }
                },
                autoComplete: 'off',
                startAdornment: (
                  <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                    <Icon fontSize='1.5rem' icon='tabler:search' />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position='end'
                    onClick={() => handleSearchDialogCloseWithReset()}
                    sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                  >
                    {!hidden ? (
                      <Typography sx={{ mr: 2.5, color: 'text.disabled' }}>
                        <Translations text={`[esc]`} />
                      </Typography>
                    ) : null}
                    <IconButton size='small' sx={{ p: 1 }}>
                      <Icon icon='tabler:x' fontSize='1.25rem' />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </DialogTitle>
          <DialogContent>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  )
}

export default AutocompleteComponent
