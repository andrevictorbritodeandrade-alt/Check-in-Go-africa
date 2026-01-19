import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  MapPin, 
  Loader2,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  TrendingDown
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
  const [locationName, setLocationName] = useState<string>('Local...');
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);

  const getPlaceName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12`);
      const data = await response.json();
      const place = data.address.city || data.address.town || data.address.suburb || "S. Africa";
      setLocationName(place);
    } catch (e) {
      setLocationName("Ativo");
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
    <div className="relative w-full p-[2px] rounded-lg shadow-2xl border-2 bg-tribal-dark border-sa-gold/50 h-full overflow-hidden">
      <div className="flex flex-col p-2 h-full w-full relative z-10 text-white">
        
        {/* Top: Location */}
        <div className="flex items-center gap-1 w-full justify-center mb-1">
          <MapPin className="w-2.5 h-2.5 text-sa-gold shrink-0" />
          <span className="text-[8px] font-black uppercase tracking-tight truncate max-w-[70px]">
            {loading ? '...' : locationName}
          </span>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-sa-gold opacity-50" />
          </div>
        ) : weather ? (
          <div className="flex-1 flex flex-col justify-between">
            {/* Center: Main Temp & Feels Like */}
            <div className="flex flex-col items-center">
              <div className="flex items-start gap-0.5">
                <span className="text-2xl font-display font-black leading-none tracking-tighter">
                  {Math.round(weather.temp)}°
                </span>
                <div className="flex flex-col -mt-1">
                  <span className="text-[7px] font-black text-sa-gold uppercase leading-none">Feels</span>
                  <span className="text-[9px] font-bold leading-none">{Math.round(weather.feelsLike)}°</span>
                </div>
              </div>
              
              {/* Max/Min Row */}
              <div className="flex gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <TrendingUp className="w-2 h-2 text-sa-red" />
                  <span className="text-[8px] font-bold">{Math.round(weather.tempMax)}°</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <TrendingDown className="w-2 h-2 text-sa-blue" />
                  <span className="text-[8px] font-bold">{Math.round(weather.tempMin)}°</span>
                </div>
              </div>
            </div>

            {/* Bottom: 3-column Grid (Rain, Humidity, Wind) */}
            <div className="grid grid-cols-3 gap-0.5 border-t border-white/10 pt-1.5 mt-1.5">
              <div className="flex flex-col items-center">
                <CloudRain className={`w-2.5 h-2.5 ${weather.rainProb > 30 ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="text-[7px] font-bold">{weather.rainProb}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplets className="w-2.5 h-2.5 text-blue-300" />
                <span className="text-[7px] font-bold">{weather.humidity}%</span>
              </div>
              <div className="flex flex-col items-center">
                <Wind className="w-2.5 h-2.5 text-slate-300" />
                <span className="text-[7px] font-bold">{Math.round(weather.windSpeed)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[8px] text-gray-500 uppercase">
            Erro
          </div>
        )}

        {/* Bottom Label Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5 text-center">
             <span className="text-sa-gold text-[6px] font-display font-black tracking-[0.2em] uppercase leading-none">
              Live Weather
            </span>
        </div>
      </div>
      
      {/* Decorative background sun */}
      <div className="absolute -bottom-2 -right-2 opacity-[0.03]">
        <CloudSun className="w-14 h-14 text-sa-gold" />
      </div>
    </div>
  );
};

export default WeatherCardHome;