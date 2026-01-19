import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Loader2,
  CloudRain,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown,
  CloudSun
} from 'lucide-react';
import { getWeather } from '../services/weatherService';

interface WeatherState {
  temp: number;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
}

const WeatherCardHome: React.FC = () => {
  const [locationName, setLocationName] = useState<string>('BUSCANDO...');
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);

  const getPlaceName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12`);
      const data = await response.json();
      const place = data.address.city || data.address.town || data.address.suburb || "S. AFRICA";
      setLocationName(place.toUpperCase());
    } catch (e) {
      setLocationName("LOCAL ATIVO");
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await getPlaceName(latitude, longitude);
        try {
          const wData = await getWeather(latitude, longitude);
          setWeather({
            temp: wData.temp,
            tempMax: wData.tempMax,
            tempMin: wData.tempMin,
            feelsLike: wData.feelsLike,
            humidity: wData.humidity,
            windSpeed: wData.windSpeed,
            rainProb: wData.rainProb
          });
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false),
      { timeout: 10000 }
    );
  }, []);

  return (
    <div className="relative w-full p-[1px] rounded-xl shadow-2xl border-2 bg-[#1a1a1a] border-sa-gold/40 h-full overflow-hidden flex flex-col">
      <div className="flex flex-col flex-1 p-2 pb-0 z-10 text-white">
        
        {/* Top: Location */}
        <div className="flex items-center gap-1 w-full justify-center mb-1">
          <MapPin className="w-2.5 h-2.5 text-sa-gold shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[80px] text-white/90">
            {loading ? '...' : locationName}
          </span>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-sa-gold opacity-50" />
          </div>
        ) : weather ? (
          <div className="flex flex-col flex-1">
            {/* Main Temp & Feels Like */}
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="text-3xl font-display font-black leading-none tracking-tighter">
                {Math.round(weather.temp)}°
              </span>
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-sa-gold uppercase leading-none mb-0.5">SENS.</span>
                <span className="text-[11px] font-bold leading-none">{Math.round(weather.feelsLike)}°</span>
              </div>
            </div>
            
            {/* Max/Min Row */}
            <div className="flex justify-center gap-3 mt-2 mb-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-sa-red" />
                <span className="text-[10px] font-black">{Math.round(weather.tempMax)}°</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-sa-blue" />
                <span className="text-[10px] font-black">{Math.round(weather.tempMin)}°</span>
              </div>
            </div>

            {/* Divider Line */}
            <div className="w-full h-[1px] bg-white/10 mx-auto"></div>

            {/* Bottom: 3-column Grid (Rain, Humidity, Wind) */}
            <div className="grid grid-cols-3 gap-1 py-2">
              <div className="flex flex-col items-center">
                <CloudRain className="w-3 h-3 text-slate-400 mb-0.5" />
                <span className="text-[8px] font-black">{weather.rainProb}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplets className="w-3 h-3 text-blue-400 mb-0.5" />
                <span className="text-[8px] font-black">{weather.humidity}%</span>
              </div>
              <div className="flex flex-col items-center border-l border-white/5">
                <Wind className="w-3 h-3 text-slate-400 mb-0.5" />
                <span className="text-[8px] font-black">{Math.round(weather.windSpeed)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[8px] text-gray-500 uppercase">
            ERRO
          </div>
        )}
      </div>

      {/* Footer Label Bar */}
      <div className="bg-black/60 py-1 text-center border-t border-white/5 mt-auto">
        <span className="text-sa-gold text-[7px] font-display font-black tracking-[0.2em] uppercase leading-none">
          CLIMA AO VIVO
        </span>
      </div>
      
      {/* Subtle background sun decoration */}
      <div className="absolute -bottom-1 -right-1 opacity-[0.05] pointer-events-none">
        <CloudSun className="w-12 h-12 text-sa-gold" />
      </div>
    </div>
  );
};

export default WeatherCardHome;