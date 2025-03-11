import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBusiness, clearMessages } from '../../slices/businessSlice';
import styles from './CreateBusiness.module.css';
import { useNavigate } from 'react-router-dom';
import { sanitizeFormData } from '../../utils/sanitize';

const CreateBusiness = () => {
  const dispatch = useDispatch();
  const { isLoading, error, successMessage } = useSelector((state) => state.business);

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cnpj: '',
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (error || successMessage) {
      setTimeout(() => {
        dispatch(clearMessages()); 
      }, 3000);
      if (successMessage) {
        setFormData({
          name: '',
          category: '',
          cnpj: '',
          profileImage: null,
        });
        setImagePreview(null); 
        navigate('/business'); 
      }
    }
  }, [error, successMessage, dispatch]);


  
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const imageFile = files[0];
      setFormData({
        ...formData,
        [name]: imageFile,
      });
      setImagePreview(URL.createObjectURL(imageFile));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  

const handleSubmit = async (e) => {
  e.preventDefault();

  const sanitizedData = sanitizeFormData(formData);

  const data = new FormData();
  data.append('name', sanitizedData.name);
  data.append('category', sanitizedData.category);
  data.append('cnpj', sanitizedData.cnpj);

  if (formData.profileImage) {
    data.append('profileImage', formData.profileImage);
  }

  await dispatch(createBusiness({ data }));

  navigate('/business')
};



  return (
    <div className={styles.container}>
      <h2 className={styles.h2_business}>Criar empresa</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      <form className={styles.form_register} onSubmit={handleSubmit}>


        {imagePreview && (
          <div className={styles.imagePreviewContainer}>
            <img src={imagePreview} alt="Profile Preview" className={styles.imagePreview} />
          </div>
        )}
        <label className={styles.label_register}>Imagem de Perfil:</label>
        <input type="file" name="profileImage" onChange={handleChange} />

        <label className={styles.label_register}>Nome:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label className={styles.label_register}>Categoria:</label>
<select
  name="category"
  value={formData.category}
  onChange={handleChange}
  required
  className={styles.select_register}
>
  <option value="" disabled>Selecione uma categoria</option>
  <option value="Passeios">Passeios</option>
</select>

        <label className={styles.label_register}>CNPJ:</label>
        <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} required />

        

        <button className={styles.btn_register} type="submit" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default CreateBusiness;




