import React, { useState } from 'react';
import style from './ImageSlideSearch.module.css'; 
import { Link } from 'react-router-dom';

const ImageSlideSearch = ({productId, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const [isLoading, setIsLoading] = useState(true);
    
  const handleImageLoad = () => {
        setIsLoading(false);
      };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={style.sliderContainer}>
      <button onClick={prevImage} className={style.sliderButton}>❮</button>
      <Link to={`/produto/${productId}`}>
      {isLoading && <div className={style.spinner}></div>}
      <img
        src={images[currentImageIndex]}
        alt={`Imagem ${currentImageIndex + 1} de ${images.length}`}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
        className={style.sliderImage}
      />
      </Link>
      
      <button onClick={nextImage} className={style.sliderButton}>❯</button>
    </div>
  );
};

export default ImageSlideSearch;
