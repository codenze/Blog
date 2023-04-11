import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./css/Header.css"
import HeaderOptions from './HeaderOptions';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar } from '@mui/material';
import { setSignOut } from './authSlice';

function Header() {
  const dispatch = useDispatch();
  const loginStatus = useSelector(state => state.auth.loginStatus);
  const currentUser = useSelector(state => state.auth.currentUser);

  const logout = () => {
    fetch("https://weathered-firefly-2748.fly.dev/logout", {
      method: "DELETE",
      credentials: "include"
    })
    .then(response => {
      if (response.status === 200) {
        dispatch(setSignOut(false)); // update login status in Redux store
        console.log('logged out');
      } else {
        throw new Error("Logout failed");
      }
    })
    .catch(error => {
      console.log("logout error", error);
    });
  }

  return (
    <div className='header'>
        <div className='header__left' >
          <div className='header__logo' >
            <img src='https://cdn-icons-png.flaticon.com/512/7837/7837765.png'/>
          </div>
          <h3>Blog App</h3>
        </div>
        <div className='header__right' >
          {/* <HeaderOptions Icon={HomeIcon} title='Feed'/> */}
          <HeaderOptions avatar={Avatar} title={currentUser.name} src={currentUser.photo}/>
          { (loginStatus &&
          <div className='logout' onClick={logout}>
            <HeaderOptions Icon={LogoutIcon} title='Log Out'/>
          </div> )
          }
        </div>
    </div>
  );
}

export default Header;
