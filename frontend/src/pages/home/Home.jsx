
import React, { useState, useEffect } from 'react';
import style from './Home.module.css';

import PromotionProducts from '../../components/PromotionProducts';
import RecentsProducts from '../../components/RecentsProducts';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
      
        const handleImageLoad = () => {
          setIsLoading(false);
        };

  const images = [
    '/1.png',
    '/2.png',
    '/3.png',
  ];

  const totalSlides = images.length;

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    setIsAutoSliding(false); 
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
    setIsAutoSliding(false); 
  };

  useEffect(() => {
    if (isAutoSliding) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoSliding, totalSlides]);

  return (
    <div className={style.container}>
      <div className={style.slider}>
        <button className={style.prevButton} onClick={goToPrevSlide}>
          &#10094;
        </button>
        <div className={style.sliderWrapper}>
          <div
            className={style.sliderContainer}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            {images.map((src, index) => (
              <div className={style.containerImgSlider}>
                {isLoading && <div className={style.spinner}></div>}
              <img
                key={index}
                className={style.container_imagem}
                src={src}
                alt={`Slide ${index + 1}`}
                onLoad={handleImageLoad}
                style={{ display: isLoading ? 'none' : 'block' }}
              /></div>
              ))}

              
          </div>
        </div>
        <button className={style.nextButton} onClick={goToNextSlide}>
          &#10095;
        </button>
      </div>
      <PromotionProducts />
      <RecentsProducts />
    </div>
  );
};

export default Home;




