import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { Icon } from '@iconify/react'
import Button from '@mui/material/Button'
import { Controller, useFieldArray } from 'react-hook-form'

import { isNonEmpty } from 'src/utils/miscellaneous'
import Translations from 'src/layouts/components/Translations'
import { FormHelperText } from '@mui/material'

const TextFieldRepeater = (props: any) => {
  const addWordFieldMaxLength = 100
  const { label, name, control, error, type, textValue } = props

  const { fields, prepend, remove, update, append } = useFieldArray<any>({
    control,
    name: name
  })

  useEffect(() => {
    !isNonEmpty(fields) && prepend('')
  }, [fields])

  return (
    <React.Fragment>
      {fields.map((field, index) => (
        <React.Fragment key={`${index}-${fields.length}`}>
          <Box sx={{ display: 'flex', pt: index === 0 ? 0 : 6, alignItems: 'flex-start' }}>
            <Controller
              name={`${name}.${index}`}
              control={control}
              render={({ field }) => (
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                  <TextField
                    fullWidth
                    type={type}
                    value={field.value}
                    label={
                      <React.Fragment>
                        <Translations text={label} /> {index + 1}
                      </React.Fragment>
                    }
                    autoFocus={true}
                    onChange={event => {
                      update(index, event.target.value)
                      field.onChange(event.target.value)
                    }}
                    inputProps={type === 'url' ? {} : { maxLength: addWordFieldMaxLength }}
                    error={Boolean(error && error[index])}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: type === 'url' ? 'row' : 'row-reverse'
                    }}
                  >
                    {type === 'text' && (
                      <Typography sx={{ color: 'grey.700', pt: 1, pr: 0.5 }}>
                        {field.value?.length || 0}/{addWordFieldMaxLength}
                      </Typography>
                    )}
                    {error && error[index] && (
                      <FormHelperText sx={{ color: 'error.main' }}>{error[index].message}</FormHelperText>
                    )}
                  </Box>
                </Box>
              )}
            />
            {index === fields.length - 1 && (
              <Button
                sx={{ ml: 3, p: 3.572 }}
                onClick={() => {
                  append('')
                }}
                variant='outlined'
                color='primary'
                size='large'
                disabled={
                  fields.length >= 5 ||
                  !isNonEmpty(textValue[index]) ||
                  fields.some((_, index) => error && error[index])
                }
              >
                <Icon icon='tabler:plus' fontSize={24} />
              </Button>
            )}
            <Button
              disabled={fields.length <= 1}
              sx={{ ml: 3, p: 3.572 }}
              onClick={() => {
                remove(index)
              }}
              variant='outlined'
              color='error'
              size='large'
            >
              <Icon icon='tabler:trash' fontSize={24} />
            </Button>
          </Box>
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}
export default TextFieldRepeater
