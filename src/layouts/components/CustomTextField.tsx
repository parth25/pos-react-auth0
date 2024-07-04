import React from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'

const CustomTextField = ({ placeholder, ...otherProps }: TextFieldProps) => {
  const { t } = useTranslation()

  return <TextField placeholder={placeholder ? (t(placeholder) satisfies string) : undefined} {...otherProps} />
}

export default CustomTextField
