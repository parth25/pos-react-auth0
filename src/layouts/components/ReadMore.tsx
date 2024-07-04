import React, { useState } from 'react'
import { Box, BoxProps, Typography, TypographyProps } from '@mui/material'
import Translations from './Translations'

interface ReadMoreProps {
  text: string
  maxLength: number
  showLessText?: React.ReactNode
  showMoreText?: React.ReactNode
  typographyProps?: TypographyProps
  boxProps?: BoxProps
}

const ReadMore: React.FC<ReadMoreProps> = ({
  text,
  maxLength,
  showLessText = <Translations text={'Read Less'} />,
  showMoreText = <Translations text={'Read More'} />,
  typographyProps = {},
  boxProps = {}
}) => {
  const [showFullText, setShowFullText] = useState<boolean>(false)

  const toggleFullText = () => {
    setShowFullText(!showFullText)
  }

  const shouldShowButton = text.length > maxLength
  const displayText = showFullText || !shouldShowButton ? text : text.slice(0, maxLength) + '... '

  return (
    <Typography {...typographyProps}>
      {displayText}
      {shouldShowButton && (
        <Box {...boxProps} onClick={toggleFullText}>
          {showFullText ? showLessText : showMoreText}
        </Box>
      )}
    </Typography>
  )
}

export default ReadMore
