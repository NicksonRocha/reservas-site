import style from './RecentsProducts.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from './ImageSlider';
import { recentsProducts } from '../slices/productSlice';

const RecentsProducts = () => {
  const dispatch = useDispatch();
  const { loading, error, recentsProduct } = useSelector((state) => state.products);
  const sliderRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch(recentsProducts());
  }, [dispatch]);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 240;
      sliderRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className={style.container}>
      <div className={style.h2_promotion}>
        <h2>Produtos Recentes</h2>
      </div>
      <div className={style.box_promotion}>
        <button onClick={() => scrollSlider('left')} className={`${style.sliderButton} ${style.left}`}>
          ←
        </button>
        <div className={style.slider_promotion} ref={sliderRef}>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {Array.isArray(recentsProduct) && recentsProduct.length > 0 ? (
            recentsProduct.map((product) => (
              <div key={product.id} className={style.box_product}>
                {product.images && product.images.length > 1 ? (
                  <ImageSlider productId={product.id} images={product.images} />
                ) : (
                  product.images &&
                  product.images.map((image, index) => (
                    <Link to={`/produto/${product.id}`} className={style.link_product} key={index}>
                      <div className={style.boxImage}>
                        {isLoading && <div className={style.spinner}></div>}
                        <img
                          src={image}
                          alt={`Imagem do produto ${product.title}`}
                          onLoad={handleImageLoad}
                          style={{ display: isLoading ? 'none' : 'block' }}
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
                    <><div className={style.boxPrice}>
                      <h3 className={style.priceOriginal}>R${product.price}</h3>
                      <h3 className={style.pricePromotion}>R${product.pricePromotion}</h3>
                    </div></>
                            ) : (
                              <div className={style.boxPrice}><h3 className={style.price}>R${product.price}</h3></div>
                              
                            )}
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Nenhum produto recente encontrado.</p>
          )}
        </div>
        <button onClick={() => scrollSlider('right')} className={`${style.sliderButton} ${style.right}`}>
          →
        </button>
      </div>
    </div>
  );
};

export default RecentsProducts;
