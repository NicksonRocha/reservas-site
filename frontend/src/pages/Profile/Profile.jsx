import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { perfil, deleteUser } from '../../slices/authSlice';
import style from './Profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { perfilUser, loading, error } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(perfil());
  }, [dispatch]);

  const handleDeleteAccount = () => {
    dispatch(deleteUser())
   
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={style.container}>
      <div className={style.box}>
        <Link to='/editar' className={style.editButton}>Editar</Link>
        
        <div className={style.profileImageWrapper}>
          <img
            src={perfilUser?.profileImageUrl || '/profileIcon.png'}
            alt="Foto de perfil"
            className={style.profileImage}
          />
        </div>

        <div className={style.userInfo}>
          <h1 className={style.userName}>{perfilUser?.name || 'Usuário'}</h1>
          <p className={style.userEmail}>
            <strong>Email:</strong> {perfilUser?.email || 'Não disponível'}
          </p>
        </div>
        <button className={style.deleteButton} onClick={() => setShowModal(true)}>
          Excluir
        </button>
      </div>

      {showModal && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <p>Tem certeza que deseja excluir sua conta? Esta ação é irreversível.</p>
            <div className={style.modalActions}>
              <button className={style.cancelButton} onClick={() => setShowModal(false)}>Cancelar</button>
              <button className={style.confirmButton} onClick={handleDeleteAccount}>Excluir</button>
              {error && <p>{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


