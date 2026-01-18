import React from 'react';
import { MenuItem } from '../types';

interface MenuCardProps extends MenuItem {
  onClick: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ 
  title, 
  icon, 
  gradientClass,
  textColor = 'text-white', 
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full p-[2px] rounded-lg shadow-2xl transition-all duration-300 active:scale-95 border-2 ${gradientClass}`}
    >
      <div className="flex flex-col items-center justify-center p-3 gap-2 h-full w-full relative z-10">
        <div className="p-1 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <span className={`${textColor} text-[10px] font-display font-black tracking-widest text-center uppercase leading-tight`}>
          {title}
        </span>
      </div>
      
      {/* Gold Inner Glow effect on hover */}
      <div className="absolute inset-0 bg-sa-gold/0 group-hover:bg-sa-gold/5 transition-colors duration-300"></div>
    </button>
  );
};

export default MenuCard;