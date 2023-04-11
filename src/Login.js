import React, { useState } from 'react'
import "./css/Login.css"
import { useDispatch, useSelector } from 'react-redux';
import { setSignIn } from './authSlice';


function Login() {
  const dispatch = useDispatch();
  const loginStatus = useSelector(state => state.auth.loginStatus);

  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [role, setRole] = useState('user');

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  }

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name) {
      return alert("Name is   required!")
    }
    if (!email) {
      return alert("Email is required!")
    }
    if (!password) {
      return alert("Password is required!")
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

    fetch("https://weathered-firefly-2748.fly.dev/registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user
      }),
      credentials: "include"
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Registration failed");
      }
    })
    .then(data => {
      if (data.status === "created") {
        console.log('registration complete', data);
        dispatch(setSignIn(data.user));
      }
    })
    .catch(error => {
      console.log("registration error", error);
    });


    setName("");
    setEmail("");
    setPassword("");

  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail) {
      return alert("Email is required!")
    }
    if (!loginPassword) {
      return alert("Password is required!")
    }

    const user = {
      email: loginEmail,
      password: loginPassword
    };

    // TODO: handle user login

    fetch("https://weathered-firefly-2748.fly.dev/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user
      }),
      credentials: "include"
    })
    .then(response => {
      console.log('response.status:', response.status);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Login failed");
      }
    })
    .then(data => {
      if (data.logged_in) {
        console.log('sucess', data);
        dispatch(setSignIn(data.user));
      } else {
        throw new Error("Login failed");
      }
    })
    .catch(error => {
      console.log("login error", error);
    });

    setLoginEmail("");
    setLoginPassword("");
  };

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
