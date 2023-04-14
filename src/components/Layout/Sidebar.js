import React from 'react'
import "../../css/Sidebar.css"
import { Avatar } from '@mui/material'
import { useSelector } from 'react-redux';

function Sidebar() {
  const currentUser = useSelector(state => state.auth.currentUser);

  return (
    <div className='sidebar'>
      <div className='sidebar__recent'>
        <div className='sidebar__profile'>
          <img alt='' src='https://png.pngtree.com/thumb_back/fh260/background/20210814/pngtree-blue-purple-simple-gradient-background-image_760572.jpg' />
          <div className='profile__details'>
            <Avatar src={currentUser.photo}/>
            <h4>{currentUser.name}</h4>
          </div>
          <p>{currentUser.role}</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
