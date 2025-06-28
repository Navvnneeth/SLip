import React, { useState, useContext } from 'react';
import styles from './css/signup.module.css';
import { useNavigate } from 'react-router-dom';
import UserContext from '../components/UserContext';
import axios from 'axios';
import { BASE_URL } from '../config';

const Signup = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmation, setConfirmation] = useState();
  const {user, login, logout} = useContext(UserContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmation){
      alert("The password confirmation does not match the original");
    }
    else{
      try{
        const response = await axios.post(`${BASE_URL}/auth/`, {username, password});
        const token = response.data.access_token;
        login({username, token: token});
        navigate("/");
      }
      catch(err){
        if(err.response){
          alert('SignUp failed: ' + err.response.data.detail);
        }
        else if(err.request){
          alert('No response from server');
        }
        else{
          console.log('SignUp error: ' + err.message);
        }
      }
    }
  }

  return (
    <div className={styles.outerBox}>
      <div className={styles.signupBox}>
        <p className={styles.signupTitle}>Sign Up</p>
        <form onSubmit={handleSubmit}>
          <label className={styles.formLabel}>Username</label>
          <input
            type="text"
            className={styles.formInput}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className={styles.formLabel}>Password</label>
          <input
            type="password"
            className={styles.formInput}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className={styles.formLabel}>Confirm Password</label>
          <input
            type="password"
            className={styles.formInput}
            onChange={(e) => setConfirmation(e.target.value)}
            required
          />

          <button type="submit" className={styles.signupButton}>
            Create Account
          </button>
        </form>

        <div className={styles.loginText}>
          <p>Already have an account?</p>
          <button className={styles.loginButton} onClick={handleLoginClick}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
