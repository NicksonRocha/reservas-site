import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessage, updateProduct, perfilProduct, deleteProductImage, showAlbum } from '../slices/productSlice';
import { Link, useParams } from 'react-router-dom';
import styles from './EditProduct.module.css';

import CreateTourOptions from './CreateTourOptions';

import ListOptionsProduct from './ListOptionsProduct';


import { sanitizeFormData } from '../utils/sanitize';

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { albums, loading, error, successMessage, product } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    title: '',
    albumId: '',
    description: '',
    price: '',   
    pricePromotion: '',   
    promotion: false,
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

  const [originalPreviews, setOriginalPreviews] = useState({
    title_one: null,
    title_two: null,
    title_three: null,
    title_four: null,
    title_five: null,
    title_six: null,
  });

  const [showScheduleTour, setShowScheduleTour] = useState(false);

  const [showListTour, setShowListTour] = useState(false);

  useEffect(() => {
    dispatch(perfilProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(showAlbum(product.BusinessId));
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        albumId: product.AlbumId || '', 
        description: product.description,
        price: product.price,
        pricePromotion: product.promotion ? product.pricePromotion : '',        
        promotion: product.promotion,
        duration: product.duration,
        title_one: product.images?.[0]?.url || null,
        title_two: product.images?.[1]?.url || null,
        title_three: product.images?.[2]?.url || null,
        title_four: product.images?.[3]?.url || null,
        title_five: product.images?.[4]?.url || null,
        title_six: product.images?.[5]?.url || null,
      });

      const imageUrls = product.images || [];
      setImagePreviews({
        title_one: imageUrls[0] || null,
        title_two: imageUrls[1] || null,
        title_three: imageUrls[2] || null,
        title_four: imageUrls[3] || null,
        title_five: imageUrls[4] || null,
        title_six: imageUrls[5] || null,
      });
      setOriginalPreviews({
        title_one: imageUrls[0] || null,
        title_two: imageUrls[1] || null,
        title_three: imageUrls[2] || null,
        title_four: imageUrls[3] || null,
        title_five: imageUrls[4] || null,
        title_six: imageUrls[5] || null,
      });
    }
  }, [product]);

const handleChange = (e) => {
  const { name, value, files, type, checked } = e.target;

  if (files) {
    const file = files[0];
    setFormData({ ...formData, [name]: file });
    setImagePreviews({ ...imagePreviews, [name]: URL.createObjectURL(file) });
  } else if (type === 'checkbox') {
    if (name === 'promotion') {
      // Atualiza promoção e limpa `pricePromotion` se necessário
      setFormData({
        ...formData,
        promotion: checked,
        pricePromotion: checked ? formData.pricePromotion : '',
      });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

  const handleRevertImage = (field) => {
    setFormData({ ...formData, [field]: originalPreviews[field] });
    setImagePreviews({ ...imagePreviews, [field]: originalPreviews[field] });
  };

  const handleDeleteImage = async (field) => {
    try {
      await dispatch(deleteProductImage({ productId: id, imageField: field }));
      setImagePreviews((prev) => ({ ...prev, [field]: null }));
      setFormData((prev) => ({ ...prev, [field]: null }));
      dispatch(perfilProduct(id));
    } catch (error) {
      console.error("Erro ao deletar a imagem:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedData = sanitizeFormData({
      title: formData.title,
      description: formData.description,
      price: formData.price,
      pricePromotion: formData.pricePromotion,
      promotion: formData.promotion,
      duration: formData.duration,
      albumId: formData.albumId,
    });

    const updatedData = new FormData();

    Object.keys(sanitizedData).forEach((key) => {
      if (sanitizedData[key] !== null && sanitizedData[key] !== undefined) {
        updatedData.append(key, sanitizedData[key]);
      }
    });

    ['title_one', 'title_two', 'title_three', 'title_four', 'title_five', 'title_six'].forEach((key) => {
      if (formData[key] !== null) {
        updatedData.append(key, formData[key]);
      }
    });

    await dispatch(updateProduct({ data: updatedData, id }));
    setTimeout(() => {
      dispatch(perfilProduct(id));
    }, 250);
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
    }
  }, [successMessage, dispatch]);

  const toggleShowScheduleTour = () => {
    setShowScheduleTour(!showScheduleTour);
    setShowListTour(false);
  };

  const toggleShowListTour = () => {
    setShowListTour(!showListTour);
    setShowScheduleTour(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <Link className={styles.back_link} to={`/product/${product.id}`}>Voltar</Link>
        <h2 className={styles.heading}>Editar</h2>
        <button className={styles.schedule_button} onClick={toggleShowScheduleTour}>
        {showScheduleTour ? 'Fechar' : 'Criar Agenda'}
      </button>
      <button className={styles.listOption_button} onClick={toggleShowListTour}>
        {showListTour ? 'Fechar' : 'Lista Agenda'}
      </button>
      </div>

      {showScheduleTour && (<CreateTourOptions/>)}
      {showListTour && (<ListOptionsProduct/>)}

      {error && <p className={styles.error}>{error}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Album:
          <select
            className={styles.input}
            name="albumId"
            value={formData.albumId}
            onChange={handleChange}
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
          Promoção:
          <input
            className={styles.checkbox}
            type="checkbox"
            name="promotion"
            checked={formData.promotion}
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
        {formData.promotion && (
  <label className={styles.label}>
    Preço da promoção:
    <input
      className={styles.input}
      type="number"
      step="0.01"
      name="pricePromotion"
      value={formData.pricePromotion || ''}
      onChange={handleChange}
      required
    />
  </label>
)}        
        
        <label className={styles.label}>
          Duração (minutos):
          <input
            className={styles.input}
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />
        </label>
        <div className={styles.imageInputRow}>
          {['title_one', 'title_two', 'title_three', 'title_four', 'title_five', 'title_six'].map((field, index) => (
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
                <div className={styles.imagePreviewWrapper}>
                  <img src={imagePreviews[field]} alt={`Prévia da imagem ${index + 1}`} className={styles.imagePreview} />
                  <div className={styles.buttonContainer}>
                    {formData[field] && imagePreviews[field] !== originalPreviews[field] && (
                      <button
                        type="button"
                        onClick={() => handleRevertImage(field)}
                        className={styles.revertButton}
                      >
                        Voltar
                      </button>
                    )}
                    {imagePreviews[field] && imagePreviews[field] === originalPreviews[field] && (
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(field)}
                        className={styles.deleteButton}
                      >
                        Deletar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Editando...' : 'Editar'}
        </button>
      </form>
    </div>
  ); 
};

export default EditProduct;


