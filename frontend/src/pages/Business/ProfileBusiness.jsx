import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; 
import { Link } from 'react-router-dom';

import style from './ProfileBusiness.module.css'; 

import { fetchBusinessProfile, fetchBusinessNotifications, businessNotificationsAsRead } from '../../slices/businessSlice';
import { fetchProductsByAlbumId, moveAlbum, showAlbum , deleteAlbum, clearSuccessMessageAlbum, clearSuccessMessageDelete} from '../../slices/productSlice'; 

import CreateProduct from '../../components/CreateProduct'; // Atualizado corretamente
import ImageSliderBusiness from '../../components/ImageSliderBusiness';
import Notifications from '../../components/Notifications';

const ProfileBusiness = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const token = useSelector((state) => state.auth.user?.token);

  const {  businessProfile, isLoadingProfile, errorProfile, notificationsBusiness } = useSelector((state) => state.business);
  const { loading, error, albums, products, successMessage, successMessageAlbum, successMessageDelete } = useSelector((state) => state.products);

  const [imgIsLoading, setImgIsLoading] = useState(true);
        
  const handleImageLoad = () => {
      setImgIsLoading(false);
  };

  
  const [openNotifications, setOpenNotifications] = useState(false);
  const unreadNotificationsCount = notificationsBusiness?.filter(notification => !notification.isRead).length || 0;

  useEffect(() => {
    if (token && id) {
      dispatch(fetchBusinessProfile({ token, id }));
      dispatch(fetchProductsByAlbumId(id))
      dispatch(fetchBusinessNotifications(id))
      clearSuccessMessageDelete()
    }
  }, [dispatch, token, id, successMessage, successMessageDelete]);
  

useEffect(() => {
  if (id) {
    dispatch(showAlbum(id));
  }
}, [id]);


useEffect(() => {
  if (successMessageAlbum) {
    dispatch(showAlbum(id)); 
    dispatch(clearSuccessMessageAlbum()); 
  }
}, [successMessageAlbum, id]);


const handleNotifications = () => {
    setOpenNotifications(!openNotifications);
    if (!openNotifications) {
      dispatch(businessNotificationsAsRead(id));
    }
  };

  const handleMoveUp = (order) => {
    dispatch(moveAlbum({ id: businessProfile.id, order, comand: 'up' }));    
  };

 
  
  const handleMoveDown = (order) => {
    dispatch(moveAlbum({ id: businessProfile.id, order, comand: 'down' }));    
  };

  const handleDeleteAlbum = (albumId) => {
    dispatch(deleteAlbum(albumId));
};

  if (isLoadingProfile) {
    return <div>Carregando...</div>;
  }

  if (errorProfile) {
    return <div>Erro: {errorProfile}</div>;
  }

  if (!businessProfile) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className={style.container}> 
      <div className={style.sup_buttons}>
        <Link to='/business' className={style.back_link}>Voltar</Link> 
        {businessProfile && (
          <div>
            <Link className={style.edit_buttons} to={`/edit-business/${businessProfile.id}`}>Editar</Link>
          </div>
        )}
      </div>
      
      <div className={style.head_profile}>
        {businessProfile.profileImageUrl && (
          <div className={style.containerImgProfile}>
            {imgIsLoading && <div className={style.spinner}></div>}
            <img 
            src={businessProfile.profileImageUrl} 
            alt="Imagem do Perfil da Empresa" 
            onLoad={handleImageLoad}
            style={{ display: imgIsLoading ? 'none' : 'block' }}
            className={style.profileImage} 
            width="200" 
          /></div>
          
        )}

        {businessProfile ? (
          <div className={style.business_info}> 
            <h1 className={style.name_info}>{businessProfile.name}</h1>
            <p><strong>Categoria:</strong> {businessProfile.category}</p>
            <p><strong>CNPJ:</strong> {businessProfile.cnpj}</p>
          </div>
        ) : (
          <p>Empresa não encontrada.</p>
        )}
        
        <div className={style.notificationsWrapper}> <button className={style.iconGearButton}><Link to={`/configuracao-empresa/${businessProfile.id}`}><img
      src="/iconGear.png"
      alt="Ícone de configuração"
      className={style.iconGear}
    /></Link>
    
  </button>
          <button onClick={handleNotifications} className={style.bellNotification}>
            <img
                src="https://icons.iconarchive.com/icons/pictogrammers/material/128/bell-icon.png"
                className={style.bellImg}
                alt="Notificações"
              /></button>
              {unreadNotificationsCount > 0 && (
                              <span className={style.notificationBadge}>
                                {unreadNotificationsCount}
                              </span>
                            )}
        </div>

        
      </div>
      <Notifications
              isOpen={openNotifications}
              onClose={() => setOpenNotifications(false)}
              notifications={notificationsBusiness || []}
            />
      <div className={style.createProductSection}> 
        <CreateProduct />
      </div>
      <div className={style.box_albums}>
        {albums && albums.map((album) => (
          <div key={album.id} className={style.box_album}>
            <div className={style.album_title}>
              <h2 className={style.h2_album}>{album.name}</h2>
              <div>
             <button className={style.btn_delete} onClick={() => handleDeleteAlbum(album.id)}>Deletar</button>
              {album.order === 0 ? (
                <button className={style.btn_change} onClick={() => handleMoveDown(album.order)}><span>&#9660;</span> </button>
              ):(<>
              <button className={style.btn_change} onClick={() => handleMoveUp(album.order)}><span>&#9650;</span> </button>
                <button className={style.btn_change} onClick={() => handleMoveDown(album.order)}><span>&#9660;</span> </button>
              </>              
              )
              }
                
              </div>
            </div>
            
            <div className={style.box_products}>
              {products && products
                .filter(product => product.AlbumId === album.id)
                .map((product) => (
                  <div key={product.id} className={style.box_product}>
                    
                    {product.images && product.images.length > 1 ? (
                      <ImageSliderBusiness productId={product.id} images={product.images} />                     
                    ) : (
                      product.images && product.images.map((image, index) => (
                        <Link to={`/product/${product.id}`} className={style.link_product} key={index}>
                          <div className={style.containerImgProduct}>
                            {imgIsLoading && <div className={style.spinner}></div>}
                            <img
                            src={image}
                            alt={`Imagem do produto ${product.title}`}
                            onLoad={handleImageLoad}
                            style={{ display: imgIsLoading ? 'none' : 'block' }}
                            className={style.imageProduct}
                          /></div>                          
                        </Link>
                      ))
                    )}
                    <Link to={`/product/${product.id}`} className={style.link_product}>
                      <div className={style.info_product}>
                        <p className={style.title}>{product.title}</p>
                        {product.promotion ? (
                      <><div className={style.boxPrice}>
                        <h3 className={style.priceOriginal}>R${product.price}</h3>
                        <h3 className={style.pricePromotion}>R${product.pricePromotion}</h3>
                      </div></>
                              ) : (
                                <h3 className={style.price}>R${product.price}</h3>
                              )}
                      </div>
    </Link>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBusiness;
