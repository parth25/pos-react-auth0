import React from 'react'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import OptionsMenu from 'src/@core/components/option-menu'
import { Settings } from 'src/@core/context/settingsContext'
import Translations from 'src/layouts/components/Translations'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()

  const handleLangItemClick = (lang: 'en' | 'de' | 'nl' | 'fr') => {
    i18n.changeLanguage(lang)
  }

  return (
    <OptionsMenu
      iconButtonProps={{ color: 'inherit' }}
      icon={<Icon fontSize='1.5rem' icon='tabler:language' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.5, minWidth: 130 } } }}
      options={[
        {
          text: <Translations text={'English'} />,
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'en',
            onClick: () => {
              handleLangItemClick('en')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: <Translations text={'Deutsch'} />,
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'de',
            onClick: () => {
              handleLangItemClick('de')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: <Translations text={'Dutch'} />,
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'nl',
            onClick: () => {
              handleLangItemClick('nl')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: <Translations text={'French'} />,
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'fr',
            onClick: () => {
              handleLangItemClick('fr')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
