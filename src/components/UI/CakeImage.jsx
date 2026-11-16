import React from 'react';
import { cakeStyles } from '../../data/products';
import CakePhoto from './CakePhoto';
import './CakeImage.css';

const CakeImage = ({ variant, image, size = 'medium', className = '', alt = 'Cake' }) => {
  const cakeStyle = cakeStyles[variant] || cakeStyles.vanilla;
  const config = {
    small: { width: 60, height: 70, layers: 2 },
    medium: { width: 120, height: 140, layers: 3 },
    large: { width: 200, height: 240, layers: 4 },
    xl: { width: 300, height: 360, layers: 5 }
  }[size];

  const { width, height, layers } = config;
  const frostingColor = cakeStyle.frosting;
  const baseColor = cakeStyle.base;
  const accentColor = cakeStyle.accent;

  if (image) {
    return (
      <div
        className={`cake-image cake-${size} cake-photo-frame ${className}`}
        role="img"
        aria-label={alt}
      >
        <CakePhoto className="cake-photo" src={image} alt="" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={`cake-image cake-${size} ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        '--frosting': frostingColor,
        '--base': baseColor,
        '--accent': accentColor
      }}
      aria-label={alt}
      role="img"
    >
      <div className="cake-stand" />
      <div className="cake-body">
        {[...Array(layers)].map((_, i) => (
          <div key={i} className="cake-layer">
            <div className="layer-sponge" style={{ background: baseColor }} />
            {i < layers - 1 && <div className="layer-frosting" style={{ background: frostingColor }} />}
          </div>
        ))}
        <div className="top-frosting" style={{ background: frostingColor }} />
      </div>
      <CakeDecoration type={cakeStyle.decoration} colors={{ base: baseColor, frosting: frostingColor, accent: accentColor }} size={size} />
      {variant === 'wedding' && <WeddingTopper size={size} />}
      {variant === 'naked' && <NakedDetails size={size} />}
    </div>
  );
};

const CakeDecoration = ({ type, colors, size }) => {
  const scale = { small: 0.5, medium: 1, large: 1.5, xl: 2 }[size];

  const decorations = {
    'chocolate-shavings': (
      <div className="decoration shavings" style={{ transform: `scale(${scale})` }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="shaving" style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 2) * 15}%`,
            background: colors.accent
          }} />
        ))}
      </div>
    ),
    'sprinkles': (
      <div className="decoration sprinkles" style={{ transform: `scale(${scale})` }}>
        {[...Array(24)].map((_, i) => (
          <div key={i} className="sprinkle" style={{
            left: `${5 + (i % 6) * 15}%`,
            top: `${10 + Math.floor(i / 6) * 20}%`,
            background: ['#E85D75', '#F8C8D8', '#FFD6E0', '#FFF0D6', '#C8E6C9'][i % 5],
            transform: `rotate(${i * 15}deg)`
          }} />
        ))}
      </div>
    ),
    'strawberries': (
      <div className="decoration strawberries" style={{ transform: `scale(${scale})` }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="strawberry" style={{ left: `${15 + i * 18}%`, top: '15%' }} />
        ))}
      </div>
    ),
    'velvet-crumbs': (
      <div className="decoration crumbs" style={{ transform: `scale(${scale})` }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="crumb" style={{
            left: `${10 + i * 7}%`,
            top: `${15 + (i % 3) * 10}%`,
            background: colors.base
          }} />
        ))}
      </div>
    ),
    'flowers': (
      <div className="decoration flowers" style={{ transform: `scale(${scale})` }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="sugar-flower" style={{
            left: `${12 + i * 14}%`,
            top: `${10 + (i % 2) * 20}%`
          }}>
            <div className="petal" style={{ background: colors.accent }} />
            <div className="petal" style={{ background: colors.accent, transform: 'rotate(60deg)' }} />
            <div className="petal" style={{ background: colors.accent, transform: 'rotate(120deg)' }} />
            <div className="center" style={{ background: colors.frosting }} />
          </div>
        ))}
      </div>
    ),
    'berries-flowers': (
      <div className="decoration berries-flowers" style={{ transform: `scale(${scale})` }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={i % 2 === 0 ? 'berry' : 'small-flower'} style={{
            left: `${10 + i * 11}%`,
            top: `${12 + (i % 3) * 12}%`
          }} />
        ))}
      </div>
    ),
    'cacao-nibs': (
      <div className="decoration nibs" style={{ transform: `scale(${scale})` }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="nib" style={{
            left: `${12 + i * 8}%`,
            top: `${18 + (i % 2) * 12}%`,
            background: '#2D1B15'
          }} />
        ))}
      </div>
    ),
    'almonds': (
      <div className="decoration almonds" style={{ transform: `scale(${scale})` }}>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="almond" style={{
            left: `${15 + i * 12}%`,
            top: '15%',
            background: colors.accent
          }} />
        ))}
      </div>
    ),
    'pecans': (
      <div className="decoration pecans" style={{ transform: `scale(${scale})` }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="pecan" style={{
            left: `${15 + i * 14}%`,
            top: '12%',
            background: '#8B5A2B'
          }} />
        ))}
      </div>
    ),
    'peppermint-bark': (
      <div className="decoration bark" style={{ transform: `scale(${scale})` }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bark-piece" style={{
            left: `${10 + i * 18}%`,
            top: '10%',
            background: i % 2 === 0 ? '#2D4A3D' : '#FFFFFF',
            border: '1px solid #C4E8D4'
          }} />
        ))}
      </div>
    ),
    'matcha-powder': (
      <div className="decoration powder" style={{ transform: `scale(${scale})` }}>
        <div className="powder-dust" style={{ background: colors.accent }} />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="powder-speck" style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 10}%`,
            background: colors.accent
          }} />
        ))}
      </div>
    ),
    'rainbow-layers': (
      <div className="decoration rainbow" style={{ transform: `scale(${scale})` }}>
        <div className="rainbow-stripes">
          {['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6'].map((color, i) => (
            <div key={i} className="stripe" style={{ background: color }} />
          ))}
        </div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="confetti" style={{
            left: `${10 + i * 8}%`,
            top: `${10 + (i % 2) * 15}%`,
            background: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6'][i % 5]
          }} />
        ))}
      </div>
    )
  };

  return decorations[type] || null;
};

const WeddingTopper = ({ size }) => {
  const scale = { small: 0.4, medium: 0.8, large: 1.2, xl: 1.6 }[size];
  return (
    <div className="wedding-topper" style={{ transform: `scale(${scale})` }}>
      <div className="topper-base" />
      <div className="topper-figures">
        <div className="figure bride" />
        <div className="figure groom" />
      </div>
    </div>
  );
};

const NakedDetails = ({ size }) => {
  const scale = { small: 0.5, medium: 1, large: 1.5, xl: 2 }[size];
  return (
    <div className="naked-details" style={{ transform: `scale(${scale})` }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="exposed-layer" style={{ top: `${25 + i * 20}%` }} />
      ))}
    </div>
  );
};

export default CakeImage;