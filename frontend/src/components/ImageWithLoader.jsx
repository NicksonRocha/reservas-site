
import { useState } from 'react';
import style from './ImageWithLoader.module.css'; 

const ImageWithLoader = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={style.imageContainer}>
      {isLoading && <div className={style.spinner}></div>}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
        className={style.sliderImage}
      />
    </div>
  );
};

export default ImageWithLoader;
