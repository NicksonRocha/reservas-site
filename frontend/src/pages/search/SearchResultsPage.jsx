import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../../slices/productSlice';
import { useLocation, Link } from 'react-router-dom';

import ImageSlideSearch from '../../components/ImageSlideSearch';

import style from './SearchResultsPage.module.css';

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const { searchResults, loading, error } = useSelector((state) => state.products);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';

  useEffect(() => {
    if (query) {
      dispatch(searchProducts({ query }));
    }
  }, [query, dispatch]);

  return (
    <div className={style.fullContainer}> 
      <h1 className={style.textTitle}>Busca de Produtos</h1>

      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}
      <div className={style.container}>
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <div key={product.id} className={style.box_product}> 

              {product.images && product.images.length > 1 ? (
                <ImageSlideSearch productId={product.id} images={product.images} />
              ) : (
                product.images && product.images.map((image, index) => (
                  <Link to={`/produto/${product.id}`} className={style.link_product} key={index}>
                    <div className={style.imageProduct} >
                      <img
                      src={image}
                      alt={`Imagem do produto ${product.title}`}
                      
                    />
                    </div>
                    
                  </Link>
                ))
              )}
              
               <Link to={`/produto/${product.id}`} className={style.link_product}>
                              <div className={style.info_product}>
                                <p className={style.title}>{product.title}</p>
                                {product.promotion ? (
                              <><div className={style.boxPrice}>
                                <h3 className={style.priceOriginal}>R${product.price}</h3>
                                <h3 className={style.pricePromotion}>R${product.pricePromotion}</h3>
                              </div></>
                                      ) : (
                                        <h3>R${product.price}</h3>
                                      )}
                              </div>
                              </Link>
            </div>
          ))
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;

