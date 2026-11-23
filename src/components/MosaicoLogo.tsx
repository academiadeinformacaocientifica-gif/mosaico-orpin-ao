import React from 'react';
import logoMosaicoImg from '../assets/images/LOGO.jpg.jpeg';
import iconMosaicoSquareImg from '../assets/images/icon_mosaico_square_1787501925065.jpg';

interface MosaicoLogoProps {
  className?: string;
  variant?: 'banner' | 'icon' | 'badge' | 'svg';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  seamless?: boolean;
}

export const MosaicoLogo: React.FC<MosaicoLogoProps> = ({ 
  className = '', 
  variant = 'banner',
  size = 'md',
  seamless = false,
}) => {
  if (variant === 'icon') {
    const sizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-10 h-10',
      xl: 'w-12 h-12'
    };

    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-md bg-[#e61e14] shadow-xs ${sizeClasses[size]} ${className}`}>
        <img 
          src={iconMosaicoSquareImg} 
          alt="Ícone Oficial Revista Mosaico Angola" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center bg-[#e61e14] px-2.5 py-1 rounded-sm shadow-xs ${className}`}>
        <span className="font-extrabold text-white text-xs tracking-wider uppercase font-sans">
          MOSAICO ANGOLA
        </span>
      </div>
    );
  }

  // Full official banner logo (cropped vertically to remove blank canvas margins)
  const heightClasses = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-14 xl:h-[68px]',
    xl: 'h-20'
  };

  const wrapperClasses = seamless
    ? 'inline-flex items-center justify-center overflow-hidden bg-white'
    : 'inline-flex items-center justify-center overflow-hidden rounded-md bg-white px-2.5 py-1 shadow-xs';

  return (
    <div className={`${wrapperClasses} ${heightClasses[size]} ${className}`}>
      <div className="h-full aspect-[3.8/1] overflow-hidden">
        <img 
          src={logoMosaicoImg} 
          alt="Logo Oficial Revista MOSAICO ANGOLA" 
          className="w-full h-full object-cover object-[50%_47.5%]"
        />
      </div>
    </div>
  );
};
