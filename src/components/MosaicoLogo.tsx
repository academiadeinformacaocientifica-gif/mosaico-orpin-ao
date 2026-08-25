import React from 'react';
import logoMosaicoImg from '../assets/images/logo_mosaico.jpeg';
import iconMosaicoSquareImg from '../assets/images/icon_mosaico_square_1787501925065.jpg';

interface MosaicoLogoProps {
  className?: string;
  variant?: 'banner' | 'icon' | 'badge' | 'svg';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MosaicoLogo: React.FC<MosaicoLogoProps> = ({ 
  className = '', 
  variant = 'banner',
  size = 'md' 
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
          alt="Ícone Oficial Revista Mosaico" 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center bg-[#e61e14] px-2.5 py-1 rounded-sm shadow-xs ${className}`}>
        <span className="font-extrabold text-white text-xs tracking-wider uppercase font-sans">
          MOSAICO
        </span>
      </div>
    );
  }

  // Full official banner logo
  const heightClasses = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
    xl: 'h-14'
  };

  return (
    <div className={`inline-flex items-center justify-center overflow-hidden rounded-md bg-[#e61e14] shadow-xs ${heightClasses[size]} ${className}`}>
      <img 
        src={logoMosaicoImg} 
        alt="Logo Oficial Revista MOSAICO" 
        className="h-full w-auto object-contain max-w-full"
      />
    </div>
  );
};
