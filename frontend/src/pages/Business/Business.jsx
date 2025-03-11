import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBusiness } from '../../slices/businessSlice';
import { Link } from 'react-router-dom';
import style from './Business.module.css';

const Business = () => {
  const dispatch = useDispatch();
  const { businesses, isLoading, error } = useSelector((state) => state.business);

  const [openNotifications, setOpenNotifications] = useState({});


  const [imgIsLoading, setImgIsLoading] = useState(true);
      
        const handleImageLoad = () => {
          setImgIsLoading(false);
        };

  useEffect(() => {
    dispatch(fetchMyBusiness());
  }, [dispatch]);

  const handleNotifications = (businessId) => {
    setOpenNotifications((prevState) => ({
      ...prevState,
      [businessId]: !prevState[businessId],
    }));
  };

  return (
    <div className={style.container}>
      <Link to='/create-business' className={style.create_business}>
        Criar Empresa
      </Link>

      <h1 className={style.business_h1}>Minhas Empresas</h1>

      {isLoading && <p>Carregando...</p>}
      {error && <p>{error}</p>}

      {!isLoading && businesses.length > 0 ? (
        <div className={style.container_businesses}>
          {businesses.map((business) => (
            <div className={style.box_business} key={business.id}>
              <Link to={`/profile-business/${business.id}`} className={style.box_link}>
                <div className={style.containerImg}>
                  {business.profileImageUrl && (
                    <div>
                      {imgIsLoading && <div className={style.spinner}></div>}
                      <img
                      src={business.profileImageUrl}
                      alt="Imagem do Perfil da Empresa"
                      onLoad={handleImageLoad}
                    style={{ display: imgIsLoading ? 'none' : 'block' }}
                      className={style.box_image}
                      width="200"
                    /></div>
                    
                  )}
                </div>
                <div className={style.box_info}>
                  <h2 className={style.businessName}>{business.name}</h2>
                  <p  className={style.businessCategory}>{business.category}</p>
                  <div className={style.notificationsWrapper}>
                    <button
                      onClick={() => handleNotifications(business.id)}
                      className={style.bellNotification}
                    >
                      <img
                        src="https://icons.iconarchive.com/icons/pictogrammers/material/128/bell-icon.png"
                        className={style.bellImg}
                        alt="Notificações"
                      />
                    </button>
                    {business.unreadNotificationsCount > 0 && (
                      <span className={style.notificationBadge}>
                        {business.unreadNotificationsCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        !isLoading && !error && <p>Você ainda não tem empresas cadastradas.</p>
      )}
    </div>
  );
};

export default Business;

