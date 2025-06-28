import React from 'react';
import styles from './slip.module.css';

const ReceiptCard = ({ receipt, onEdit, onDelete }) => {
  return (
    <div className={styles.card}>
      <div className={styles.amount}>₹{receipt.amount}</div>
      <div className={styles.details}>
        <p><span>Date:</span> {receipt.date}</p>
        <p><span>Time:</span> {receipt.time}</p>
        <p><span>Address:</span> {receipt.address}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={() => onEdit(receipt.id)}>Edit</button>
        <button className={styles.deleteBtn} onClick={() => onDelete(receipt.id)}>Delete</button>
      </div>
    </div>
  );
};

export default ReceiptCard;
