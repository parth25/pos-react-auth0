// ** MUI Imports
import { ThemeOptions } from '@mui/material'

// ** To use core palette, uncomment the below import
import { PaletteMode } from '@mui/material'

// ** To use core palette, uncomment the below import
import corePalette from 'src/@core/theme/palette'

// ** To use mode (light/dark/semi-dark), skin(default/bordered), direction(ltr/rtl), etc. for conditional styles, uncomment below line
import { useSettings } from 'src/@core/hooks/useSettings'

const UserThemeOptions = (): ThemeOptions => {
  // ** To use mode (light/dark/semi-dark), skin(default/bordered), direction(ltr/rtl), etc. for conditional styles, uncomment below line
  const { settings } = useSettings()

  // ** To use mode (light/dark/semi-dark), skin(default/bordered), direction(ltr/rtl), etc. for conditional styles, uncomment below line
  const { mode, skin } = settings

  // ** To use core palette, uncomment the below line
  corePalette(mode as PaletteMode, skin)
  const whiteColor = '#FFF'
  const lightColor = '28, 28, 28'
  const darkColor = '228, 230, 244'
  const darkPaperBgColor = '#0b2338'
  const mainColor = mode === 'light' ? lightColor : darkColor

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return whiteColor
    } else if (skin === 'bordered' && mode === 'dark') {
      return darkPaperBgColor
    } else if (mode === 'light') {
      return '#F8F7FA'
    } else return '#061a2a'
  }

  return {
    palette: {
      customColors: {
        dark: darkColor,
        main: mainColor,
        light: lightColor,
        lightPaperBg: whiteColor,
        darkPaperBg: darkPaperBgColor,
        bodyBg: mode === 'light' ? '#F8F7FA' : '#0b2338', // Same as palette.background.default but doesn't consider bordered skin
        trackBg: mode === 'light' ? '#F1F0F2' : '#273143',
        avatarBg: mode === 'light' ? '#F6F6F7' : '#1B2831',
        tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#1B2831'
      },
      primary: {
        light: '#365da1',
        main: mode === 'light' ? '#0761AE' : '#046bd7',
        dark: mode === 'light' ? '#054B95' : '#046bd7',
        contrastText: '#FFF'
      },
      success: {
        100: '#D1FACD',
        200: '#9DF59F',
        300: '#68E176',
        400: '#40C35C',
        500: '#119B3C',
        600: '#0C853D',
        700: '#086F3C',
        800: '#055938',
        900: '#034A35'
      },
      error: {
        100: '#FCE0CE',
        200: '#FABA9F',
        300: '#F08A6E',
        400: '#E15D48',
        500: '#CE1D14',
        600: '#B10E14',
        700: '#940A1A',
        800: '#77061D',
        900: '#62031F'
      },
      warning: {
        100: mode === 'light' ? '#FFFADC' : 'transparent',
        200: '#FEE898',
        300: '#FDD665',
        400: '#FBC53E',
        500: '#F9AA00',
        600: '#D68B00',
        700: '#B36E00',
        800: '#905400',
        900: '#774200'
      },
      info: {
        100: '#CFECFD',
        200: '#A0D6FB',
        300: '#70B8F4',
        400: '#4C9BEA',
        500: '#1670DD',
        600: '#1056BE',
        700: '#0B409F',
        800: '#072D80',
        900: '#041F6A'
      },
      grey: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: mode === 'light' ? '#212121' : `rgba(${mainColor}, 0.68)`,
        A100: '#F5F5F5',
        A200: '#EEEEEE',
        A400: '#BDBDBD',
        A700: '#616161'
      },
      background: {
        paper: mode === 'light' ? whiteColor : darkPaperBgColor,
        default: defaultBgColor()
      },
      text: {
        primary: `rgba(${mainColor}, 0.80)`,
        secondary: `rgba(${mainColor}, 0.68)`,
        disabled: `rgba(${mainColor}, 0.42)`
      }
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1920
      }
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true
        },
        styleOverrides: {
          root: {
            textTransform: 'none'
          },
          sizeSmall: {
            padding: '6px 16px'
          },
          sizeMedium: {
            padding: '8px 20px'
          },
          sizeLarge: {
            padding: '11px 24px'
          },
          textSizeSmall: {
            padding: '7px 12px'
          },
          textSizeMedium: {
            padding: '9px 16px'
          },
          textSizeLarge: {
            padding: '12px 16px'
          }
        }
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            padding: '16px 24px'
          }
        }
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '24px 24px',
            '&:last-child': {
              paddingBottom: '24px'
            }
          }
        }
      },
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box'
          },
          html: {
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%'
          },
          body: {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%'
          },
          '#__next': {
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            height: '100%',
            width: '100%'
          }
        }
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            minWidth: '6rem',
            '&.MuiTablePagination-select': {
              minWidth: '1.5rem !important'
            }
          }
        }
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '0.6875rem',
            padding: '4px 8px'
          }
        }
      }
    },
    shape: {
      borderRadius: 8
    },
    typography: {
      fontFamily:
        '"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"'
    },
    shadows:
      mode === 'light'
        ? [
            'none',
            '0px 2px 4px 1px rgba(51, 48, 60, 0.03), 0px 3px 4px 0px rgba(51, 48, 60, 0.02), 0px 1px 3px 2px rgba(51, 48, 60, 0.01)',
            '0px 3px 5px 2px rgba(51, 48, 60, 0.03), 0px 3px 5px 0px rgba(51, 48, 60, 0.02), 0px 1px 4px 2px rgba(51, 48, 60, 0.01)',
            '0px 3px 6px 2px rgba(51, 48, 60, 0.03), 0px 4px 6px 0px rgba(51, 48, 60, 0.02), 0px 1px 4px 2px rgba(51, 48, 60, 0.01)',
            '0px 2px 7px 1px rgba(51, 48, 60, 0.03), 0px 4px 7px 0px rgba(51, 48, 60, 0.02), 0px 1px 4px 2px rgba(51, 48, 60, 0.01)',
            '0px 3px 8px 1px rgba(51, 48, 60, 0.03), 0px 6px 8px 0px rgba(51, 48, 60, 0.02), 0px 1px 5px 4px rgba(51, 48, 60, 0.01)',
            '0px 3px 9px 1px rgba(51, 48, 60, 0.03), 0px 8px 9px 0px rgba(51, 48, 60, 0.02), 0px 1px 6px 4px rgba(51, 48, 60, 0.01)',
            '0px 4px 10px 2px rgba(51, 48, 60, 0.03), 0px 9px 10px 1px rgba(51, 48, 60, 0.02), 0px 2px 7px 4px rgba(51, 48, 60, 0.01)',
            '0px 5px 11px 3px rgba(51, 48, 60, 0.03), 0px 8px 11px 1px rgba(51, 48, 60, 0.02), 0px 3px 8px 4px rgba(51, 48, 60, 0.01)',
            '0px 5px 12px 3px rgba(51, 48, 60, 0.03), 0px 9px 12px 1px rgba(51, 48, 60, 0.02), 0px 3px 9px 5px rgba(51, 48, 60, 0.01)',
            '0px 6px 13px 3px rgba(51, 48, 60, 0.03), 0px 10px 13px 1px rgba(51, 48, 60, 0.02), 0px 4px 10px 5px rgba(51, 48, 60, 0.01)',
            '0px 6px 14px 4px rgba(51, 48, 60, 0.03), 0px 11px 14px 1px rgba(51, 48, 60, 0.02), 0px 4px 11px 5px rgba(51, 48, 60, 0.01)',
            '0px 7px 15px 4px rgba(51, 48, 60, 0.03), 0px 12px 15px 2px rgba(51, 48, 60, 0.02), 0px 5px 12px 5px rgba(51, 48, 60, 0.01)',
            '0px 7px 16px 4px rgba(51, 48, 60, 0.03), 0px 13px 16px 2px rgba(51, 48, 60, 0.02), 0px 5px 13px 6px rgba(51, 48, 60, 0.01)',
            '0px 7px 17px 4px rgba(51, 48, 60, 0.03), 0px 14px 17px 2px rgba(51, 48, 60, 0.02), 0px 5px 14px 6px rgba(51, 48, 60, 0.01)',
            '0px 8px 18px 5px rgba(51, 48, 60, 0.03), 0px 15px 18px 2px rgba(51, 48, 60, 0.02), 0px 6px 15px 6px rgba(51, 48, 60, 0.01)',
            '0px 8px 19px 5px rgba(51, 48, 60, 0.03), 0px 16px 19px 2px rgba(51, 48, 60, 0.02), 0px 6px 16px 6px rgba(51, 48, 60, 0.01)',
            '0px 8px 20px 5px rgba(51, 48, 60, 0.03), 0px 17px 20px 2px rgba(51, 48, 60, 0.02), 0px 6px 17px 7px rgba(51, 48, 60, 0.01)',
            '0px 9px 21px 5px rgba(51, 48, 60, 0.03), 0px 18px 21px 2px rgba(51, 48, 60, 0.02), 0px 7px 18px 7px rgba(51, 48, 60, 0.01)',
            '0px 9px 22px 6px rgba(51, 48, 60, 0.03), 0px 19px 22px 2px rgba(51, 48, 60, 0.02), 0px 7px 19px 7px rgba(51, 48, 60, 0.01)',
            '0px 10px 23px 6px rgba(51, 48, 60, 0.03), 0px 20px 23px 3px rgba(51, 48, 60, 0.02), 0px 8px 20px 7px rgba(51, 48, 60, 0.01)',
            '0px 10px 24px 6px rgba(51, 48, 60, 0.03), 0px 21px 24px 3px rgba(51, 48, 60, 0.02), 0px 8px 21px 7px rgba(51, 48, 60, 0.01)',
            '0px 10px 25px 6px rgba(51, 48, 60, 0.03), 0px 22px 25px 3px rgba(51, 48, 60, 0.02), 0px 8px 22px 7px rgba(51, 48, 60, 0.01)',
            '0px 11px 26px 7px rgba(51, 48, 60, 0.03), 0px 23px 26px 3px rgba(51, 48, 60, 0.02), 0px 9px 23px 7px rgba(51, 48, 60, 0.01)',
            '0px 11px 27px 7px rgba(51, 48, 60, 0.03), 0px 24px 27px 3px rgba(51, 48, 60, 0.02), 0px 9px 24px 7px rgba(51, 48, 60, 0.01)'
          ]
        : [
            'none',
            '0px 2px 4px 1px rgba(12, 16, 27, 0.15), 0px 3px 4px 0px rgba(12, 16, 27, 0.1), 0px 1px 3px 2px rgba(12, 16, 27, 0.08)',
            '0px 3px 5px 2px rgba(12, 16, 27, 0.15), 0px 3px 5px 0px rgba(12, 16, 27, 0.1), 0px 1px 4px 2px rgba(12, 16, 27, 0.08)',
            '0px 3px 6px 2px rgba(12, 16, 27, 0.15), 0px 4px 6px 0px rgba(12, 16, 27, 0.1), 0px 1px 4px 2px rgba(12, 16, 27, 0.08)',
            '0px 2px 7px 1px rgba(12, 16, 27, 0.15), 0px 4px 7px 0px rgba(12, 16, 27, 0.1), 0px 1px 4px 2px rgba(12, 16, 27, 0.08)',
            '0px 3px 8px 1px rgba(12, 16, 27, 0.15), 0px 6px 8px 0px rgba(12, 16, 27, 0.1), 0px 1px 5px 4px rgba(12, 16, 27, 0.08)',
            '0px 3px 9px 1px rgba(12, 16, 27, 0.15), 0px 8px 9px 0px rgba(12, 16, 27, 0.1), 0px 1px 6px 4px rgba(12, 16, 27, 0.08)',
            '0px 4px 10px 2px rgba(12, 16, 27, 0.15), 0px 9px 10px 1px rgba(12, 16, 27, 0.1), 0px 2px 7px 4px rgba(12, 16, 27, 0.08)',
            '0px 5px 11px 3px rgba(12, 16, 27, 0.15), 0px 8px 11px 1px rgba(12, 16, 27, 0.1), 0px 3px 8px 4px rgba(12, 16, 27, 0.08)',
            '0px 5px 12px 3px rgba(12, 16, 27, 0.15), 0px 9px 12px 1px rgba(12, 16, 27, 0.1), 0px 3px 9px 5px rgba(12, 16, 27, 0.08)',
            '0px 6px 13px 3px rgba(12, 16, 27, 0.15), 0px 10px 13px 1px rgba(12, 16, 27, 0.1), 0px 4px 10px 5px rgba(12, 16, 27, 0.08)',
            '0px 6px 14px 4px rgba(12, 16, 27, 0.15), 0px 11px 14px 1px rgba(12, 16, 27, 0.1), 0px 4px 11px 5px rgba(12, 16, 27, 0.08)',
            '0px 7px 15px 4px rgba(12, 16, 27, 0.15), 0px 12px 15px 2px rgba(12, 16, 27, 0.1), 0px 5px 12px 5px rgba(12, 16, 27, 0.08)',
            '0px 7px 16px 4px rgba(12, 16, 27, 0.15), 0px 13px 16px 2px rgba(12, 16, 27, 0.1), 0px 5px 13px 6px rgba(12, 16, 27, 0.08)',
            '0px 7px 17px 4px rgba(12, 16, 27, 0.15), 0px 14px 17px 2px rgba(12, 16, 27, 0.1), 0px 5px 14px 6px rgba(12, 16, 27, 0.08)',
            '0px 8px 18px 5px rgba(12, 16, 27, 0.15), 0px 15px 18px 2px rgba(12, 16, 27, 0.1), 0px 6px 15px 6px rgba(12, 16, 27, 0.08)',
            '0px 8px 19px 5px rgba(12, 16, 27, 0.15), 0px 16px 19px 2px rgba(12, 16, 27, 0.1), 0px 6px 16px 6px rgba(12, 16, 27, 0.08)',
            '0px 8px 20px 5px rgba(12, 16, 27, 0.15), 0px 17px 20px 2px rgba(12, 16, 27, 0.1), 0px 6px 17px 7px rgba(12, 16, 27, 0.08)',
            '0px 9px 21px 5px rgba(12, 16, 27, 0.15), 0px 18px 21px 2px rgba(12, 16, 27, 0.1), 0px 7px 18px 7px rgba(12, 16, 27, 0.08)',
            '0px 9px 22px 6px rgba(12, 16, 27, 0.15), 0px 19px 22px 2px rgba(12, 16, 27, 0.1), 0px 7px 19px 7px rgba(12, 16, 27, 0.08)',
            '0px 10px 23px 6px rgba(12, 16, 27, 0.15), 0px 20px 23px 3px rgba(12, 16, 27, 0.1), 0px 8px 20px 7px rgba(12, 16, 27, 0.08)',
            '0px 10px 24px 6px rgba(12, 16, 27, 0.15), 0px 21px 24px 3px rgba(12, 16, 27, 0.1), 0px 8px 21px 7px rgba(12, 16, 27, 0.08)',
            '0px 10px 25px 6px rgba(12, 16, 27, 0.15), 0px 22px 25px 3px rgba(12, 16, 27, 0.1), 0px 8px 22px 7px rgba(12, 16, 27, 0.08)',
            '0px 11px 26px 7px rgba(12, 16, 27, 0.15), 0px 23px 26px 3px rgba(12, 16, 27, 0.1), 0px 9px 23px 7px rgba(12, 16, 27, 0.08)',
            '0px 11px 27px 7px rgba(12, 16, 27, 0.15), 0px 24px 27px 3px rgba(12, 16, 27, 0.1), 0px 9px 24px 7px rgba(12, 16, 27, 0.08)'
          ],
    zIndex: {
      appBar: 1100,
      drawer: 1200
    }
  }
}

export default UserThemeOptions
