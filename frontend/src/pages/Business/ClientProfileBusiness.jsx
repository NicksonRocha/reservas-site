import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';

import style from './ClientProfileBusiness.module.css';

import { fetchClientBusinessProfile } from '../../slices/businessSlice';
import { fetchProductsByAlbumId, showAlbum } from '../../slices/productSlice';

import ImageSliderBusiness from '../../components/ImageSliderBusiness';

const ClientProfileBusiness = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { clientBusinessProfile, isLoadingClientProfile, errorClientProfile } = useSelector((state) => state.business);
  const { albums, products } = useSelector((state) => state.products);

  const [imgIsLoading, setImgIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(fetchClientBusinessProfile(id));
      dispatch(fetchProductsByAlbumId(id)); 
      dispatch(showAlbum(id));
    }
  }, [dispatch, id]);

  const handleImageLoad = () => {
    setImgIsLoading(false);
  };

  if (isLoadingClientProfile) {
    return <div>Carregando...</div>;
  }

  if (errorClientProfile) {
    return <div>Erro: {errorClientProfile}</div>;
  }

  if (!clientBusinessProfile) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={style.container}>
      <div className={style.head_profile}>
        {clientBusinessProfile.profileImageUrl && (
          <div className={style.containerImgProfile}>
            {imgIsLoading && <div className={style.spinner}></div>}
            <img
              src={clientBusinessProfile.profileImageUrl}
              alt="Imagem do Perfil da Empresa"
              onLoad={handleImageLoad}
              style={{ display: imgIsLoading ? 'none' : 'block' }}
              className={style.profileImage}
              width="200"
            />
          </div>
        )}

        <div className={style.business_info}>
          <h1 className={style.name_info}>{clientBusinessProfile.name}</h1>
          <p><strong>Categoria:</strong> {clientBusinessProfile.category}</p>
        </div>
      </div>

      <div className={style.box_albums}>
        {albums && albums.map((album) => (
          <div key={album.id} className={style.box_album}>
            <div className={style.album_title}>
              <h2 className={style.h2_album}>{album.name}</h2>
            </div>

            <div className={style.box_products}>
              {products && products
                .filter((product) => product.AlbumId === album.id)
                .map((product) => (
                  <div key={product.id} className={style.box_product}>
                    {product.images && product.images.length > 1 ? (
                      <ImageSliderBusiness productId={product.id} images={product.images} />
                    ) : (
                      product.images && product.images.map((image, index) => (
                        <Link to={`/produto/${product.id}`} className={style.link_product} key={index}>
                          <div className={style.containerImgProduct}>
                            {imgIsLoading && <div className={style.spinner}></div>}
                            <img
                              src={image}
                              alt={`Imagem do produto ${product.title}`}
                              onLoad={handleImageLoad}
                              style={{ display: imgIsLoading ? 'none' : 'block' }}
                              className={style.imageProduct}
                            />
                          </div>
                        </Link>
                      ))
                    )}
                    <Link to={`/produto/${product.id}`} className={style.link_product}>
                      <div className={style.info_product}>
                        <p className={style.title}>{product.title}</p>
                        {product.promotion ? (
                          <div className={style.boxPrice}>
                            <h3 className={style.priceOriginal}>R${product.price}</h3>
                            <h3 className={style.pricePromotion}>R${product.pricePromotion}</h3>
                          </div>
                        ) : (
                          <h3>R${product.price}</h3>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientProfileBusiness;

