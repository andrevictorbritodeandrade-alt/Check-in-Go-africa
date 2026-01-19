import React from 'react';

const Header: React.FC = () => {
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
                {/* Ícone da Terra SVG */}
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-full h-full drop-shadow-[0_0_30px_rgba(0,119,73,0.6)] filter brightness-110"
                >
                  <circle cx="12" cy="12" r="10" fill="#3b82f6" />
                  <path 
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.5 4.5C15.5 4.5 14 6 13 6C12 6 11 5 11 5V3.5C12.3 3.1 13.9 3.5 15.5 4.5ZM17 12C17 12.5 16.5 13 16 13H15V14.5C15 15.3 14.3 16 13.5 16H11V18H13C13.55 18 14 18.45 14 19V20.2C17.4 19.3 20 16 20 12H17ZM5.5 15C4.6 14.1 4 12.8 4 11.5C4 10.8 4.1 10.2 4.4 9.6L8 13.2V15H5.5ZM9 16.5V14H11V12H15V11H13.5C12.7 11 12 10.3 12 9.5V8H10V6.5C10 5.7 10.7 5 11.5 5H12.6C11.7 4.3 10.6 3.9 9.5 3.7V5C9.5 5.6 9.1 6 8.5 6H6.8C7.5 5 8.4 4.3 9.5 3.7V2.2C5.9 3 3.1 5.8 2.3 9.4L6.6 13.7C6.9 14.8 7.8 15.7 9 16.5Z" 
                    fill="#16a34a"
                  />
                </svg>
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