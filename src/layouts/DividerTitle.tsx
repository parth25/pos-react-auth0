import Divider from '@mui/material/Divider'
import React from 'react'

interface Props {
  title: React.ReactNode
}

const DividerTitle = ({ title }: Props) => {
  return (
    <Divider variant={'middle'} sx={{ textAlign: 'center', fontWeight: 600, color: 'primary.dark' }}>
      {title}
    </Divider>
  )
}
export default DividerTitle
