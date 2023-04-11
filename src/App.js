import React, { useState, useEffect } from 'react';
import Feed from './Feed';
import Header from './Header';
import Login from './Login';
import Sidebar from './Sidebar';
import Widget from './Widget'
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus, setCurrentUser, setSignIn } from './authSlice';

function App() {
  const dispatch = useDispatch();
  const loginStatus = useSelector(state => state.auth.loginStatus);
  const currentUser = useSelector(state => state.auth.currentUser);

  const checkLoginStatus = () => {
    fetch("https://weathered-firefly-2748.fly.dev/logged_in", {
      method: "GET",
      credentials: "include"
    }).then(response => response.json())
      .then(data => {
        if (data.logged_in){
        console.log('logged in:', data);
        console.log('logggin innnnnn');
        dispatch(setSignIn(data.user));
        console.log('currentUser, loginStatus:', currentUser, loginStatus);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (!loginStatus || !currentUser) {
    return <Login />;
  } else {
    return (
      <div className='wrapper'>
        <Header />
        <div className='body'>
          <Sidebar />
          <Feed/>
          <Widget/>
        </div>
      </div>
    );
  }
}

export default App;
