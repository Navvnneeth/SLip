import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../components/UserContext';
import Slip from '../components/slip';
import styles from './css/home.module.css';
import NavBar from '../components/NavBar';
import { BASE_URL } from '../config';

const Home = () => {
  const navigate = useNavigate();
  const {user, login, logout} = useContext(UserContext);

  const [slips, setSlips] = useState([]);

  const token = localStorage.getItem("token");

  const getUserSlips = async () => {
    try{
      const res = await axios.get(`${BASE_URL}/receipts/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSlips(res.data)
      //console.log('response' + res.data)
    }catch(err){
      alert("Error: " + err.message);
    }
  };

  useEffect(() => {

    if (!token) {
      navigate("/login");
    } else {
      const verifyTokenAndGetUser = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const username = res.data.username;
          login({ username, token: token });
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem("token")
          navigate("/login"); 
        }
      };

      verifyTokenAndGetUser();

      getUserSlips();
    }
  }, [navigate]);

  const handleEdit = (id) => {
    navigate('/Edit/' + id);
  };

  const handleDelete = async (id) => {
    try{
      const response = await axios.delete(`${BASE_URL}/receipts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
          }
      });

      if(response.status == 204){
        alert('Receipt deleted');
        getUserSlips();
      }
    }
    catch(err){
      alert('Error: ' + err.message);
    }

  };

  const handleAddClick = () => {
    navigate('/add')
  }

  return (

    <div className={styles.container}>
      <NavBar/>
      <main className={styles.content}>
        {slips && slips.length > 0 ? (
          slips.map((r) => (
            <Slip key={r.id} receipt={r} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <p className={styles.empty}>No receipts found.</p>
        )}
      </main>

      <button className={styles.addButton} onClick={handleAddClick}>＋ Add Slip</button>
    </div>
  );
};

export default Home;
