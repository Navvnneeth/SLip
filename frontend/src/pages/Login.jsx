import React, { useContext, useState } from 'react';
import styles from'./css/login.module.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../components/UserContext';
import { BASE_URL } from '../config';

const Login = () => {

  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup')
  }

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const {user, login, logout} = useContext(UserContext);

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${BASE_URL}/auth/token`,
      new URLSearchParams({ username, password }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    //console.log(response);
    const token = response.data.access_token;
    login({ username, token: token });
    navigate('/');
  } catch (err) {
    if (err.response) {
      alert('Login failed: ' + err.response.data.detail);
    } else if (err.request) {
      alert('No response from server');
    } else {
      console.log('Login error: ' + err.message);
    }
  }
};

  return (
    <div className={styles['login-container']}>
      
      <div className={styles['login-box']}>
        <p className={styles['login-title']}>Log In</p>
        <form onSubmit={handleSubmit}>
          <label className={styles['form-label']}>Username</label>
          <input
            type="text"
            name="username"
            className={styles['form-input']}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className={styles['form-label']}>Password</label>
          <input
            type="password"
            name="password"
            className={styles['form-input']}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className={styles["login-button"]}
          >
            Log In
          </button>
        </form>
      </div>

      <div className={styles["signup-panel"]}>
        <div className={styles["signup-title"]}>Welcome to SLip</div>
        <div className={styles["signup-text"]}>Don't have an account?</div>
        <button className={styles["signup-button"]} onClick={() => {handleSignUpClick()}}>
          Sign Up
        </button>
      </div>
      
    </div>
  );
};

export default Login;


