import styles from './Message.module.css';

const Message = ({ msg, type }) => {
  return (
    <div className={`${styles.message} ${styles[type]}`}>
      <p>{msg}</p>
    </div>
  );
}

export default Message;