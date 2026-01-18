import React from 'react';

const Header: React.FC = () => {
  // Imagem da Terra fotográfica ultra-realista (NASA style)
  const earthImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1200px-Earth_Western_Hemisphere_transparent_background.png";

  return (
    <div className="relative w-full min-h-[200px] sm:min-h-[260px] flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Layer: Retratos com alta visibilidade */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-95">
        <div className="relative w-full h-full flex items-center justify-around filter blur-[15px] transform scale-110">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/800px-Nelson_Mandela_1994.jpg" 
            alt="Nelson Mandela" 
            className="h-full w-1/2 object-cover grayscale opacity-70"
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Desmond_Tutu_2011.jpg/800px-Desmond_Tutu_2011.jpg" 
            alt="Desmond Tutu" 
            className="h-full w-1/2 object-cover grayscale opacity-70"
          />
        </div>
      </div>
      
      {/* South Africa Flag Overlay */}
      <div 
        className="absolute inset-0 z-1 opacity-40 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: 'url("https://flagcdn.com/w2560/za.png")' }}
      ></div>
      
      {/* Gradiente de profundidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/70 z-2"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-full flex flex-col items-center justify-center px-4 py-6 text-center">
        
        {/* Título Ajustado */}
        <div className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center w-full">
          <h1 className="font-display font-black text-white text-[10vw] sm:text-[11vw] md:text-[11.5vw] lg:text-[12vw] tracking-tighter text-shadow-heavy uppercase leading-none italic flex flex-row flex-nowrap items-center justify-center select-none whitespace-nowrap drop-shadow-[0_15px_40px_rgba(0,0,0,1)]">
            <span className="drop-shadow-2xl">CHECK-IN,</span>
            <span className="flex items-center ml-[0.12em]">
              G
              <div className="relative inline-flex items-center justify-center w-[0.92em] h-[0.92em] mx-[-0.03em]">
                <img 
                  src={earthImageUrl} 
                  alt="Terra Ultra Realista 4K" 
                  className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(0,119,73,0.6)]"
                />
              </div>
              !
            </span>
          </h1>
          
          {/* Subtítulo "ÁFRICA DO SUL" */}
          <h2 className="font-display font-black text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.4em] text-shadow-heavy uppercase mt-2 opacity-100 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
            ÁFRICA DO SUL
          </h2>
        </div>

        {/* Barra de destaque dourada */}
        <div className="w-[18vw] max-w-[140px] h-2 bg-sa-gold rounded-full mt-5 shadow-[0_0_60px_rgba(255,184,28,0.9)] animate-pulse border-b-2 border-black/30"></div>
      </div>
    </div>
  );
};

export default Header;