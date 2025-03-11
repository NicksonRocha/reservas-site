import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessages, editBusinessSlice, deleteProfileImageSlice } from '../../slices/businessSlice';
import style from './EditBusiness.module.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBusinessProfile } from '../../slices/businessSlice';
import { sanitizeFormData } from '../../utils/sanitize';

const EditBusiness = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    profileImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null); 
  const [isPreviewing, setIsPreviewing] = useState(false); 

  const fileInputRef = useRef(null);

  const { businessProfile, isLoading, error, successMessage } = useSelector(
    (state) => state.business
  );
  const token = useSelector((state) => state.auth.user?.token);

  useEffect(() => {
    dispatch(fetchBusinessProfile({ token, id }));
  }, [id, token, dispatch]);

  useEffect(() => {
    if (businessProfile) {
      setFormData({
        name: businessProfile.name || '',
        category: businessProfile.category || '',
        profileImage: null,
      });
      setImagePreview(businessProfile.profileImageUrl || null); 
      setIsPreviewing(false); 
    }
  }, [businessProfile]);

  useEffect(() => {
    if (error || successMessage) {
      setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
    }
  }, [error, successMessage, dispatch]);

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (name === 'profileImage' && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, profileImage: file });
      setImagePreview(URL.createObjectURL(file)); 
      setIsPreviewing(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitizedData = sanitizeFormData(formData);

    if (!sanitizedData.name.trim() || !sanitizedData.category.trim()) {
      alert('Por favor, insira um nome e categoria válidos!');
      return;
    }

    const updatedData = new FormData();
    updatedData.append('name', sanitizedData.name);
    updatedData.append('category', sanitizedData.category);
    if (formData.profileImage) {
      updatedData.append('profileImage', formData.profileImage);
    }

    dispatch(editBusinessSlice({ data: updatedData, id }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setFormData({
      name: '',
      category: '',
      profileImage: null,
    });
    setImagePreview(null);
    setIsPreviewing(false);
  };


  const handleResetPreview = () => {
    setImagePreview(businessProfile.profileImageUrl || null);
    setIsPreviewing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const handleDeleteImage = (e) => {
    e.preventDefault();
    dispatch(deleteProfileImageSlice({ id }));
    setImagePreview(null); 
    setFormData({ ...formData, profileImage: null });
  };

  return (
    <div className={style.container}>
      <Link to={`/profile-business/${businessProfile?.id}`} className={style.back_link}>
        Voltar
      </Link>
      {error && <p className={style.error}>{error}</p>}
      {successMessage && <p className={style.success}>{successMessage}</p>}
      {businessProfile ? (
        <div>
          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.box_profile}>
              {imagePreview && (
                <div className={style.box_img}>
                  <img
                    src={imagePreview}
                    alt="Prévia da Imagem do Perfil"
                    className={style.profileImage}
                  />
                  {isPreviewing ? (
                    <button
                      type="button"
                      className={style.reset}
                      onClick={handleResetPreview}
                    >
                      Voltar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={style.trash}
                      onClick={handleDeleteImage}
                    >
                      Apagar
                    </button>
                  )}
                </div>
              )}
              <div className={style.sub_box}>
                <label className={style.input}>
                  Imagem de Perfil:
                  <input
                    type="file"
                    name="profileImage"
                    ref={fileInputRef}
                    onChange={handleChange}
                  />
                </label>
                <label className={style.input}>
                  Nome da Empresa:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </label>
                <label className={style.label_register}>Categoria:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                  className={style.select_register}
                >
                  <option value="" disabled>
                    Selecione uma categoria
                  </option>
                  <option value="Passeios">Passeios</option>
                </select>
                <p className={style.input}>
                  <strong>CNPJ:</strong> {businessProfile.cnpj}
                </p>
              </div>
            </div>
            <button className={style.btn_send} type="submit" disabled={isLoading}>
              {isLoading ? 'Editando...' : 'Editar Empresa'}
            </button>
          </form>
        </div>
      ) : (
        <p>Empresa não encontrada.</p>
      )}
      
    </div>
  );
};

export default EditBusiness;
