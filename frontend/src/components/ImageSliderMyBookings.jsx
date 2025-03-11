import React, { useState } from 'react';
import style from './ImageSliderMyBookings.module.css';

const ImageSliderMyBookings = ({ productId, images, onClickImage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
        
    const handleImageLoad = () => {
      setIsLoading(false);
    };

  const nextImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (event) => {
    event.stopPropagation(); 
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={style.sliderContainer} onClick={onClickImage}>
      <button onClick={prevImage} className={style.sliderButton}>
        ❮
      </button>
      {isLoading && <div className={style.spinner}></div>}
      <img
        src={images[currentImageIndex]}
        alt={`Imagem ${currentImageIndex + 1} de ${images.length}`}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
        className={style.sliderImage}
      />
      <button onClick={nextImage} className={style.sliderButton}>
        ❯
      </button>
    </div>
  );
};

export default ImageSliderMyBookings;
