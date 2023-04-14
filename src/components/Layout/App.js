import React, { useEffect } from 'react';
import Feed from './Feed';
import Header from '../Header/Header';
import Login from '../Login/Login';
import Sidebar from './Sidebar';
import Widget from './Widget'
import Notification from '../Notification/Notification'
import { useDispatch, useSelector } from 'react-redux';
import { setSignIn } from '../../slices/authSlice';
import "../../css/App.css"


function App() {
  const dispatch = useDispatch();
  const loginStatus = useSelector(state => state.auth.loginStatus);
  const notification = useSelector(state => state.notification.notification);
  const message = useSelector(state => state.notification.message);
  const isSuccess = useSelector(state => state.notification.isSuccess);


//https://weathered-firefly-2748.fly.dev/logged_in
  const checkLoginStatus = () => {
    fetch("https://weathered-firefly-2748.fly.dev/logged_in", {
      method: "GET",
      credentials: "include"
    }).then(response => response.json())
      .then(data => {
        if (data.logged_in){
        dispatch(setSignIn(data.user));
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (!loginStatus) {
    return(
      <div>
        { notification
        && ( <Notification message={message} isSuccess={isSuccess}/> )
        }
        <Login />
      </div>
    );
  } else {
    return (
      <div className='wrapper'>
        <Header />
        { notification
        && ( <Notification message={message} isSuccess={isSuccess}/> )
        }
        <div className='body'>
          <Sidebar className='sidebar'/>
          <Feed className='feed'/>
          <Widget/>
        </div>
      </div>
    );
  }
}

export default App;
