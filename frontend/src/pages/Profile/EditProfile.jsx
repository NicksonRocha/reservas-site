import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, clearPopUpMsg } from '../../slices/authSlice';
import styles from './EditProfile.module.css';
import { sanitizeFormData } from '../../utils/sanitize';


const EditProfile = () => {
  const dispatch = useDispatch();
  const { editUser, loading, error, successMsg } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: editUser?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        dispatch(clearPopUpMsg());
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [error, successMsg, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedData = sanitizeFormData(formData);

    if (sanitizedData.newPassword && sanitizedData.newPassword !== sanitizedData.confirmNewPassword) {
      alert('As novas senhas não coincidem.');
      return;
    }

    const updateData = {
      name: sanitizedData.name || null,
      ...(sanitizedData.currentPassword && { currentPassword: sanitizedData.currentPassword }),
      ...(sanitizedData.newPassword && { newPassword: sanitizedData.newPassword }),
    };

    dispatch(updateUserProfile(updateData)); 
  };

  return (
    <div className={styles.fullContainer}>

    
    <div className={styles.cosmosContainer}>
      <form onSubmit={handleSubmit} className={styles.galaxyForm}>
        <label htmlFor="name" className={styles.lunaticLabel}>
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={styles.satelliteInput}
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />

        <label htmlFor="currentPassword" className={styles.lunaticLabel}>
          Senha Atual
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          className={styles.satelliteInput}
          value={formData.currentPassword}
          onChange={handleChange}
          disabled={loading}
        />

        <label htmlFor="newPassword" className={styles.lunaticLabel}>
          Nova Senha
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          className={styles.satelliteInput}
          value={formData.newPassword}
          onChange={handleChange}
          disabled={loading}
        />

        <label htmlFor="confirmNewPassword" className={styles.lunaticLabel}>
          Confirme a Nova Senha
        </label>
        <input
          type="password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          className={styles.satelliteInput}
          value={formData.confirmNewPassword}
          onChange={handleChange}
          disabled={loading}
        />

        <button type="submit" disabled={loading} className={styles.spaceshipButton}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      {error && (
        <div className={`${styles.popup} ${styles['popup-error']}`}>{error}</div>
      )}
      {successMsg && (
        <div className={`${styles.popup} ${styles['popup-success']}`}>
          {successMsg}
        </div>
      )}
    </div>
    </div>
  );
};

export default EditProfile;


