import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessageAlbum, createAlbum } from '../slices/productSlice';
import styles from './CreateAlbum.module.css'; 
import { useParams, Link } from 'react-router-dom';

import { sanitizeFormData } from '../utils/sanitize'; 

const CreateAlbum = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '', 
  });

  const { loading, error, successMessageAlbum } = useSelector((state) => state.products);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitizedData = sanitizeFormData(formData);

    dispatch(createAlbum({ data: sanitizedData, id }));
  };

  useEffect(() => {
    if (successMessageAlbum) {
      setFormData({ name: '' }); 

      setTimeout(() => {
        dispatch(clearSuccessMessageAlbum());
      }, 3000);
    }
  }, [successMessageAlbum, dispatch]);

  

  return (
    <div className={styles.container}>
        
        <div>
          <h2 className={styles.heading}>Criar Álbum</h2>
          {error && <p className={styles.error}>{error}</p>}
          {successMessageAlbum && <p className={styles.success}>{successMessageAlbum}</p>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Nome do Álbum:
              <input
                className={styles.input}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Álbum'}
            </button>
          </form>
        </div>
      
    </div>
  );
};

export default CreateAlbum;


