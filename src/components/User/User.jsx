import React from 'react'
import { Avatar } from '@mui/material'


function User({user}) {
  return (
    <div className='posts'>
      <div className='post__header'>
        <div className='post__headerLeft'>
          <Avatar src={user.photo}/>
          <div className='post__profile_details'>
            <h3>{user.name}</h3>
            <p>{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
