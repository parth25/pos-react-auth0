import React from 'react'
import Input, { InputProps } from '@mui/material/Input'
import { useTranslation } from 'react-i18next'

const CustomInputField = ({ placeholder, ...otherProps }: InputProps) => {
  const { t } = useTranslation()

  return <Input placeholder={placeholder ? (t(placeholder) satisfies string) : undefined} {...otherProps} />
}

export default CustomInputField
