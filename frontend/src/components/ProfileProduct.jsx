
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsByAlbumId, deleteProduct, perfilProduct, clearSuccessMessageDelete, clearProduct } from '../slices/productSlice';
import style from './ProfileProduct.module.css';

const ProfileProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, product, successMessageDelete} = useSelector((state) => state.products);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const [imgIsLoading, setImgIsLoading] = useState(true);
          
  const handleImageLoad = () => {
    setImgIsLoading(false);
  };

  const navigate = useNavigate()
 
  useEffect(() => {
    if (id) {
      dispatch(perfilProduct(id));
    }
  }, [id]);

  useEffect(() => {
    const updateProducts = async () => {
      if (successMessageDelete) {
        try {
          await dispatch(fetchProductsByAlbumId(product.BusinessId));
          
          
          dispatch(clearSuccessMessageDelete());
          
          dispatch(clearProduct())
          navigate(`/profile-business/${product.BusinessId}`);
        } catch (error) {
          
        }
      }
    };
  
    updateProducts();
  }, [successMessageDelete, dispatch, navigate, product.BusinessId]);
  
  useEffect(() => {
    return () => {
      dispatch(clearSuccessMessageDelete());
    };
  }, [dispatch]);
  

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteProduct({ id }));
  };
  
  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
  
    if (mins === 0) {
      return `${hours} Hora${hours > 1 ? 's' : ''}`;
    }
  
    if (hours === 0) {
      return `${mins} Minuto${mins > 1 ? 's' : ''}`;
    }
  
    return `${hours} Hora${hours > 1 ? 's' : ''} e ${mins} Minuto${mins > 1 ? 's' : ''}`;
  };

  return (
    <div className={style.fullContainer}>
<div className={style.container}>
      <div className={style.box_image}>
        {product.images && product.images.length > 1 ? (
          <div className={style.sliderContainer}>
            <button onClick={prevImage} className={style.sliderButton}>❮</button>
            <div className={style.containerImgProfile}>
            {imgIsLoading && <div className={style.spinner}></div>}
            <img
              src={product.images[currentImageIndex]}
              alt={`Imagem ${currentImageIndex + 1} de ${product.images.length}`}
              onLoad={handleImageLoad}
              style={{ display: imgIsLoading ? 'none' : 'block' }}
              className={style.sliderImage}
            />
            </div>
            <button onClick={nextImage} className={style.sliderButton}>❯</button>
          </div>
        ) : (
          product.images && product.images.map((image, index) => (
            <div className={style.containerImgProduct}>
            {imgIsLoading && <div className={style.spinner}></div>}
            <img
              key={index}
              src={image}
              alt={`Imagem do produto ${product.title}`}
              onLoad={handleImageLoad}
              style={{ display: imgIsLoading ? 'none' : 'block' }}
              className={style.imageProduct}
            />
            </div>
          ))
        )}

<p>{product.description}</p>
{product.duration > 0 && <p><strong>Duração:</strong> {formatDuration(product.duration)}</p>}
      </div>

      <div className={style.box_info}>
        <h1  className={style.title}>{product.title}</h1>
                
       {product.promotion ? (
                                   <><div className={style.boxPrice}>
                                     <h3 className={style.priceOriginal}>R${product.price}</h3>
                                     <h3 className={style.pricePromotion}>R${product.pricePromotion}</h3>
                                   </div></>
                                           ) : (
                                             <h3>R${product.price}</h3>
                                           )}
        <div className={style.actionButtons}>
        <Link to={`/confirmacao-ticket/${product.id}`} className={style.btns}>Confirmar Tickets</Link>
          <Link to={`/lista-agendamentos/${product.id}`} className={style.btns}>Lista Agendamentos</Link>
          <Link to={`/edit-product/${product.id}`} className={style.btns}>Editar</Link>
          <button className={style.btns} onClick={handleDeleteClick}>Deletar</button>
        </div>
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

    <div  className={style.tabletsContainer}>
      
    {product.images && product.images.length > 1 ? (
          <div className={style.sliderContainer}>
            <button onClick={prevImage} className={style.sliderButton}>❮</button>
            <div className={style.containerImgProfile}>
            {imgIsLoading && <div className={style.spinner}></div>}
            <img
              src={product.images[currentImageIndex]}
              alt={`Imagem ${currentImageIndex + 1} de ${product.images.length}`}
              onLoad={handleImageLoad}
              style={{ display: imgIsLoading ? 'none' : 'block' }}
              className={style.sliderImage}
            />
            </div>
            <button onClick={nextImage} className={style.sliderButton}>❯</button>
          </div>
        ) : (
          product.images && product.images.map((image, index) => (
            <div className={style.containerImgProduct}>
            {imgIsLoading && <div className={style.spinner}></div>}
            <img
              key={index}
              src={image}
              alt={`Imagem do produto ${product.title}`}
              onLoad={handleImageLoad}
              style={{ display: imgIsLoading ? 'none' : 'block' }}
              className={style.imageProduct}
            />
            </div>
          ))
        )}
<div className={style.infoTablets}>
  <h1 className={style.title}>{product.title}</h1>
  {product.promotion ? (
                                   <><div className={style.boxPrice}>
                                     <h3 className={style.priceOriginal}>R${product.price}</h3>
                                     <h3 className={style.pricePromotion}>R${product.pricePromotion}</h3>
                                   </div></>
                                           ) : (
                                             <h3>R${product.price}</h3>
                                           )}
        <div className={style.actionTabletsButtons}>
        <Link to={`/confirmacao-ticket/${product.id}`} className={style.btns}>Confirmar Tickets</Link>
          <Link to={`/lista-agendamentos/${product.id}`} className={style.btns}>Lista Agendamentos</Link>
          <Link to={`/edit-product/${product.id}`} className={style.btns}>Editar</Link>
          <button className={style.btns} onClick={handleDeleteClick}>Deletar</button>
        </div>
<p>{product.description}</p>
{product.duration > 0 && <p><strong>Duração:</strong> {formatDuration(product.duration)}</p>}
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
    </div>
    
  );
};

export default ProfileProduct;



