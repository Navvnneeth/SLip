import React, { useEffect, useState } from 'react';
import styles from './css/add.module.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import WebcamCapture from './WebcamCapture';
import { BASE_URL } from '../config';

const Edit = () => {

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const token = localStorage.getItem("token");
  const [cam, setCam] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchReceiptAndSetValues = async (receipt_id) => {
        const response = await axios.get(`${BASE_URL}/receipts/${receipt_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const receipt = response.data;
        setAmount(receipt.amount);
        setAddress(receipt.address);
        setDate(receipt.date);
        setTime(receipt.time);
    };

    fetchReceiptAndSetValues(id);

  }, [])

  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try{
        const response = await axios.post(`${BASE_URL}/receipts/upload-image`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    const receipt = response.data;
    console.log(receipt);
    setAmount(receipt.amount || '');
    setAddress(receipt.address || '');
    setDate(receipt.date || '');
    setTime(receipt.time || '');
    }catch(err){
        alert("Error: " + err.message);
    }

  };

  const handleCameraClick = () => {
    setCam(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const receipt = {
        amount, date, time, address
    };
    try{
        const response = await axios.put(`${BASE_URL}/receipts/${id}`, receipt, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const newReceipt = response.data
        console.log(newReceipt)
        navigate('/')
        
    }catch(err){
        alert("Error: ", err.message);
    }
  };

  function base64ToFile(base64Data, filename, mimeType = 'image/jpeg') {
    const arr = base64Data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1] || mimeType;
    const bstr = atob(arr[1]); // decode base64
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const handleWebcamSubmit = async (img) => {
    const imageFile = base64ToFile(img, "image.jpg");

    const formData = new FormData();
    formData.append('file', imageFile)

    try{
      const response = await axios.post(`${BASE_URL}/receipts/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'multipart/form-data'
        }
      });
      const data = response.data;
      console.log(data);
      setAddress(data.address || '');
      setAmount(data.amount || '');
      setDate(data.date || '');
      setTime(data.time || '');
      setCam(false);
    }catch(err){
      alert('Error: ' + err.message);
    }

  }

  return (

    cam ? <WebcamCapture handleSubmit={handleWebcamSubmit}/> : 

    <div className={styles.container}>
      <h2 className={styles.heading}>Add New Slip</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>Amount</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} required />

        <label>Date</label>
        <input type="text" value={date} placeholder='dd/mm/yyyy' onChange={(e) => setDate(e.target.value)} required />

        <label>Time</label>
        <input type="text" value={time} placeholder='hh: mm' onChange={(e) => setTime(e.target.value)} required />

        <label>Address</label>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />

        <div className={styles.buttons}>
          <label className={styles.uploadButton}>
            Upload Image
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>

          <button type="button" className={styles.cameraButton} onClick={handleCameraClick}>
            Use Camera
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
    </div>
  );
};

export default Edit;
