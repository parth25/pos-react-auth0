import React, { useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { isNonEmpty } from 'src/utils/miscellaneous'
import Translations from './Translations'
import { FormHelperText } from '@mui/material'
import { Controller, useFieldArray } from 'react-hook-form'
import { CompanyCountry, PortalCountry } from 'src/generated-sources/swagger-api'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'

export interface CompanyCountryFieldRepeaterProps {
  control: any
  selectedCompanyCountriesError: any
  portalCountries: PortalCountry[]
  selectedCompanyCountries: CompanyCountry[] | undefined
}

const CompanyCountryFieldRepeater = (props: CompanyCountryFieldRepeaterProps) => {
  const { control, selectedCompanyCountriesError, portalCountries, selectedCompanyCountries } = props
  const initialDisplayCount = 3

  type FormValues = {
    selectedCompanyCountries: Array<CompanyCountry>
  }

  const { fields, prepend, remove, update, append } = useFieldArray<FormValues, 'selectedCompanyCountries', 'id'>({
    control,
    name: 'selectedCompanyCountries'
  })

  const [showMore, setShowMore] = useState(false)
  const selectedCountryIds = new Set(fields?.map(item => item?.portalCountry?.id))

  const filteredPortalCountries = portalCountries.filter((item: PortalCountry) => {
    // Check if item is not null and has a non-null id
    return item !== null && item.id !== undefined && !selectedCountryIds.has(item.id)
  })

  useEffect(() => {
    !isNonEmpty(fields) && prepend({ portalCountry: {} as PortalCountry, baseUrl: '' })
  }, [])

  return (
    <React.Fragment>
      {fields?.slice(0, showMore ? fields?.length : initialDisplayCount).map((companyCountry, index) => {
        return (
          <React.Fragment key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                pt: index === 0 ? 0 : 6,
                alignItems: 'flex-start'
              }}
              key={index}
            >
              <Box sx={{ flex: 1, width: { xs: '100%' } }}>
                <Controller
                  name={`selectedCompanyCountries.${index}.portalCountry`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      fullWidth
                      disableClearable
                      options={filteredPortalCountries}
                      value={companyCountry.portalCountry}
                      isOptionEqualToValue={(option: PortalCountry, value: PortalCountry) => option?.id === value?.id}
                      onChange={(event, newValue) => {
                        update(index, { portalCountry: newValue as PortalCountry, baseUrl: companyCountry?.baseUrl })
                        field.onChange(newValue)
                      }}
                      getOptionLabel={option => option?.displayName || ''}
                      renderOption={(props, option) => (
                        <Box component='li' sx={{ '& > svg': { mr: 1, flexShrink: 0 } }} {...props}>
                          <Icon icon={option?.icon} /> {option?.displayName}
                        </Box>
                      )}
                      renderInput={params => (
                        <TextField
                          required
                          {...params}
                          variant='outlined'
                          label={
                            <React.Fragment>
                              {<Translations text={'Product countries'} />} {index + 1}
                            </React.Fragment>
                          }
                          error={Boolean(
                            selectedCompanyCountriesError ? selectedCompanyCountriesError[index]?.portalCountry : false
                          )}
                        />
                      )}
                      noOptionsText={<Translations text={'No data found!'} />}
                    />
                  )}
                />
                {selectedCompanyCountriesError && selectedCompanyCountriesError[index]?.portalCountry && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {selectedCompanyCountriesError[index]?.portalCountry.message}
                  </FormHelperText>
                )}
              </Box>
              <Box sx={{ flex: 1, width: { xs: '100%' } }}>
                <Controller
                  name={`selectedCompanyCountries.${index}.baseUrl`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      required
                      fullWidth
                      type={'url'}
                      label={
                        <React.Fragment>
                          {<Translations text={'Enter base url'} />} {index + 1}
                        </React.Fragment>
                      }
                      value={companyCountry?.baseUrl}
                      onChange={event => {
                        update(index, { portalCountry: companyCountry?.portalCountry, baseUrl: event.target.value })
                        field.onChange(event)
                      }}
                      error={Boolean(
                        selectedCompanyCountriesError ? selectedCompanyCountriesError[index]?.baseUrl : false
                      )}
                    />
                  )}
                />
                {selectedCompanyCountriesError && selectedCompanyCountriesError[index]?.baseUrl && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {selectedCompanyCountriesError[index]?.baseUrl.message}
                  </FormHelperText>
                )}
              </Box>
              {index === fields.length - 1 && (
                <Button
                  onClick={() => {
                    append({ portalCountry: filteredPortalCountries[0] as PortalCountry, baseUrl: '' })
                  }}
                  disabled={portalCountries?.length === fields?.length}
                  sx={{ p: 3.823 }}
                  variant='outlined'
                  color='primary'
                  size='large'
                >
                  <Icon icon='tabler:plus' />
                </Button>
              )}
              <Button
                disabled={fields?.length <= 1}
                onClick={() => {
                  remove(index)
                }}
                sx={{ p: 3.823 }}
                variant='outlined'
                color='error'
                size='large'
              >
                <Icon icon='tabler:trash' />
              </Button>
            </Box>
          </React.Fragment>
        )
      })}
      {fields?.length > initialDisplayCount && (
        <Box sx={{ display: 'flex', pt: 6, justifyContent: 'center' }}>
          <IconButton onClick={() => setShowMore(!showMore)} color='primary'>
            <Icon icon={`tabler:chevron-${showMore ? 'up' : 'down'}`} />
          </IconButton>
        </Box>
      )}
    </React.Fragment>
  )
}

export default CompanyCountryFieldRepeater
