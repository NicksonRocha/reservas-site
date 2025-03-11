import React from 'react';
import styles from './Notifications.module.css';

const Notifications = ({ isOpen, onClose, notifications }) => {
  return (
    <div className={`${styles.notifications} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h2>Notificações</h2>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
      <ul className={styles.list}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index} className={styles.item}>
              <p><strong>Mensagem:</strong> {notification.message}</p>
              <p>{new Date(notification.createdAt).toLocaleString()}</p>
            </li>
          ))
        ) : (
          <li className={styles.empty}>Sem notificações</li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
