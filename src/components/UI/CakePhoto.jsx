import React from 'react';

const FALLBACK_IMAGE = `${process.env.PUBLIC_URL}/images/cakes/cake-01.jpg`;

const CakePhoto = ({ src, alt = '', ...props }) => {
  const handleImageError = (event) => {
    const image = event.currentTarget;
    if (!image.dataset.fallbackApplied) {
      image.dataset.fallbackApplied = 'true';
      image.src = FALLBACK_IMAGE;
    }
  };

  return <img {...props} src={src || FALLBACK_IMAGE} alt={alt} onError={handleImageError} />;
};

export default CakePhoto;
