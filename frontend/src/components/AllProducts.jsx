import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; 
import { fetchProducts } from '../slices/productSlice'
import { Link } from 'react-router-dom';

import ImageSliderBusiness from './ImageSliderBusiness';

import style from './AllProducts.module.css';

const AllProducts = () => {

  const { loading, error, products } = useSelector((state) => state.products);

  return (
    <div className={style.fullContainer}>
      <h1>Todos os Produtos</h1>

      <div className={style.container} >{products && products              
                .map((product) => (
                  <div key={product.id} className={style.box_product}>
                    
                    {product.images && product.images.length > 1 ? (
                      <ImageSliderBusiness productId={product.id} images={product.images} />
                    ) : (
                      product.images && product.images.map((image, index) => (
                        <Link to={`/product/${product.id}`} className={style.link_product} key={index}>
                          <img
                            src={image}
                            alt={`Imagem do produto ${product.title}`}
                            className={style.imageProduct}
                          />
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
              }</div>

    </div>
  )
}

export default AllProducts

