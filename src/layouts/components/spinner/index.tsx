// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { PropagateLoader } from 'react-spinners'
import themeConfig from 'src/configs/themeConfig'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Typography variant='h2' component='h2'>
        {themeConfig.templateName}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <PropagateLoader color={theme.palette.primary.main} />
      </Box>
    </Box>
  )
}

export default FallbackSpinner
