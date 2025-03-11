
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessage, createProduct, showAlbum } from '../slices/productSlice'; 

import { useParams, Link} from 'react-router-dom';

import CreateAlbum  from './CreateAlbum'; 

import AllProducts from './AllProducts';

import styles from './CreateProduct.module.css'; 

import { sanitizeFormData } from '../utils/sanitize';

const CreateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [albumId, setAlbumId] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    title_one: null,
    title_two: null,
    title_three: null,
    title_four: null,
    title_five: null,
    title_six: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    title_one: null,
    title_two: null,
    title_three: null,
    title_four: null,
    title_five: null,
    title_six: null,
  });

  const [showForm, setShowForm] = useState(false);

  const [showFormAlbum, setShowFormAlbum] = useState(false);

  const [showProducts, setShowProducts] = useState(false);

  const { loading, error, successMessage, albums } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(showAlbum(id))
  }, [showAlbum, id])
  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (files) {
      const file = files[0]; 
      setFormData({ ...formData, [name]: file });

      const previewUrl = URL.createObjectURL(file);
      setImagePreviews({ ...imagePreviews, [name]: previewUrl });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

      const sanitizedData = sanitizeFormData(formData);
  
    const updatedData = new FormData();
    updatedData.append('title', sanitizedData.title);
    updatedData.append('description', sanitizedData.description);
    updatedData.append('price', sanitizedData.price);
    updatedData.append('duration', sanitizedData.duration);
    
    if (albumId) {
      updatedData.append('AlbumId', albumId);
    } 
  
    ['title_one', 'title_two', 'title_three', 'title_four', 'title_five', 'title_six'].forEach((key) => {
      if (formData[key]) {
        updatedData.append('images', formData[key]);
      }
    });
  
    dispatch(createProduct({ data: updatedData, id }));
  };  

  useEffect(() => {
    if (successMessage) {
      setFormData({
        title: '',
        description: '',
        price: '',
  
        promotion: false,
        duration: '',
        title_one: null,
        title_two: null,
        title_three: null,
        title_four: null,
        title_five: null,
        title_six: null,
      });

      setAlbumId('')

      setImagePreviews({
        title_one: null,
        title_two: null,
        title_three: null,
        title_four: null,
        title_five: null,
        title_six: null,
      });

      setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
    }
  }, [successMessage, dispatch]);

  const toggleForm = () => {
    setShowForm(!showForm);
    setShowFormAlbum(false);
    setShowProducts(false);
  };

  const toggleFormAlbum = () => {
    setShowFormAlbum(!showFormAlbum);
    setShowProducts(false);
    setShowForm(false);
  };

  const toggleShowProduct = () => {
    setShowProducts(!showProducts);
    setShowFormAlbum(false);
    setShowForm(false);
  };

 

  return (
    <div className={styles.container}>

      <div  className={styles.togglesContainer}>
        <button className={styles.toggleButton} onClick={toggleForm}>
        {showForm ? 'Fechar' : 'Criar Produto'}
      </button>

      <button className={styles.toggleButton} onClick={toggleFormAlbum}>
        {showFormAlbum ? 'Fechar' : 'Criar Album'}
      </button>

      <button className={styles.toggleButton} onClick={toggleShowProduct}>
        {showProducts ? 'Fechar' : 'Ver Produtos'}
      </button>
      </div>

      


      {showProducts && (<AllProducts/>)}

      
      {showFormAlbum && (<CreateAlbum/>)}
      

      {showForm && (
        <div>
          <h2 className={styles.heading}>Criar Produto</h2>
          
          
          <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
  Album:
  <select
    className={styles.input}
    name="albumId"
    value={albumId}
    onChange={(e) => setAlbumId(e.target.value)}
  >
    <option value="">Selecione um álbum</option>
    {albums && albums.map((album) => (
      <option key={album.id} value={album.id}>
        {album.name}
      </option>
    ))}
  </select>
</label>

            <label className={styles.label}>
              Título:
              <input
                className={styles.input}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>
            <label className={styles.label}>
              Descrição:
              <input
                className={styles.input}
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </label>             
            <label className={styles.label}>
              Preço:
              <input
                className={styles.input}
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>
           
            <label className={styles.label}>
  Duração:
  <select
    className={styles.input}
    name="duration"
    value={formData.duration}
    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
    required
  >
    {Array.from({ length: 97 }, (_, i) => i * 15).map((minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const label = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      return (
        <option key={minutes} value={minutes}>
          {label}
        </option>
      );
    })}
  </select>
</label>

            <div className={styles.imageInputRow}>
              {['title_one', 'title_two', 'title_three'].map((field, index) => (
                <div key={index} className={styles.imageInputWrapper}>
                  <label className={styles.imageInput}>
                    Imagem {index + 1}:
                    <input
                      className={styles.input}
                      type="file"
                      name={field}
                      onChange={handleChange}
                    />
                  </label>
                  {imagePreviews[field] && (
                    <img
                      src={imagePreviews[field]}
                      alt={`Prévia da imagem ${index + 1}`}
                      className={styles.imagePreview}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className={styles.imageInputRow}>
              {['title_four', 'title_five', 'title_six'].map((field, index) => (
                <div key={index} className={styles.imageInputWrapper}>
                  <label className={styles.imageInput}>
                    Imagem {index + 4}:
                    <input
                      className={styles.input}
                      type="file"
                      name={field}
                      onChange={handleChange}
                    />
                  </label>
                  {imagePreviews[field] && (
                    <img
                      src={imagePreviews[field]}
                      alt={`Prévia da imagem ${index + 4}`}
                      className={styles.imagePreview}
                    />
                  )}
                </div>
              ))}
            </div>

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Produto'}
            </button>
            {successMessage && <p className={styles.success}>{successMessage}</p>}
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;
