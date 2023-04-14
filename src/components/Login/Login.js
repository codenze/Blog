import React, { useEffect, useState } from 'react'
import "../../css/Login.css"
import { useDispatch } from 'react-redux';
import { setCurrentUser, setSignIn } from '../../slices/authSlice';
import {login, register} from './authentication_actions';
import { useSelector } from 'react-redux';
import { setNotification } from '../../slices/notificationSlice';
function Login() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState('user');

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const currentUser = useSelector(state => state.auth.currentUser);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  }

  const handleRegister = async(e) => {
    e.preventDefault();
    if (!name) {
      return notify("Name is required!", false);
    }
    if (!email) {
      return notify("Email is required!", false);
    }
    if (!password) {
      return notify("Password is required!", false);
    }
    // TODO: handle user registration

    const user = {
      email,
      password,
      password_confirmation: password,
      name,
      photo,
      role
    };

    const response = await register(user);
    if (response) {
      dispatch(setCurrentUser(response));
    }

    setName("");
    setEmail("");
    setPassword("");

  };

  function notify(m, s) {
    dispatch(setNotification(
      {
        notification: true,
        message: m,
        isSuccess: s
      }));
    }

  const handleLogin = async(e) => {
    e.preventDefault();
    if (!loginEmail) {
      notify("Email is required!", false);
      return;
      // return alert("Email is required!")
    }
    if (!loginPassword) {
      notify("Password is required!", false);
      return;
    }

    const user = {
      email: loginEmail,
      password: loginPassword
    };

    const response = await login(user);
    if (response) {
     dispatch(setCurrentUser(response));
     notify("Success!", true);
    } else {
      notify("Failed!", false);
    }

    setLoginEmail("");
    setLoginPassword("");
  };

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
  }, [currentUser]);

  return (

    <div className='main'>
      <div className='logo'>
        <h2>Blog APP</h2>
        <p>Start writing today!</p>
      </div>
      <div className='container'>
        <div className='tabs'>
          <div
            className={activeTab === "login" ? "active" : "select"}
            onClick={() => handleTabClick("login")}
          >
            Login
          </div>
          <div
            className={activeTab === "register" ? "active" : "select"}
            onClick={() => handleTabClick("register")}
          >
            Register
          </div>
        </div>
        {activeTab === "login" ? (
          <div className='login'>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder='Email Address'
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder='Password'
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
              <input type="submit" value="Sign In" />
            </form>
          </div>
        ) : (
          <div className='registration'>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder='Full Name'
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder='Email Address'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder='Photo URL'
                value={photo}
                onChange={e => setPhoto(e.target.value)}
              />
              <div className='user_role' >
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <input type="submit" value="Sign Up" />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
