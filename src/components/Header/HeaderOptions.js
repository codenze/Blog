import React from 'react'
import { Avatar } from '@mui/material'


function HeaderOptions({Icon, title, avatar, src}) {
  return (
    <div className='header__options'>
      {
        Icon && <Icon></Icon>
      }
      {
        avatar && <Avatar name={avatar} src={src} />
      }
      <span>{title}</span>
    </div>
  )
}

export default HeaderOptions
