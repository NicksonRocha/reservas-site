import React from 'react'
import { useState,  } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import { deleteBusiness, clearMessages } from '../../slices/businessSlice';
import style from './Configuration.module.css';

const Configuration = () => {
  const navigate = useNavigate()
  const { id } = useParams()
    const dispatch = useDispatch();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteClick = () => {
        setShowConfirm(true);
      };
    
      
      const confirmDelete = async () => {
        await dispatch(deleteBusiness({ id }));
        setTimeout(() => {
          navigate('/business'); 
        }, 2000); 
        await dispatch(clearMessages())
      };
      
      const cancelDelete = () => {
        setShowConfirm(false);
      };
    

  return (
    <div>
        <div className={style.boxDelete}>
            <h1>Excluir empresa.</h1>
            <p>Se você deseja excluir está empresa,<button className={style.clickHere} onClick={handleDeleteClick}>clique aqui.</button> </p>
        </div>
    {showConfirm && (
      <div className={style.confirmPopup}>
        <p>Você tem certeza?</p>
        <div className={style.confirmPopupButtons}>
          <button className={style.btn_popup} onClick={confirmDelete}>Sim</button>
          <button className={style.btn_cancel} onClick={cancelDelete}>Cancelar</button>
        </div>
      </div>
    )}
    </div>
  )
}

export default Configuration

