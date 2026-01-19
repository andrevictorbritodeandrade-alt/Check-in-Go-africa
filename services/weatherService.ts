interface WeatherData {
  temp: number;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  rainProb: number;
  isDay: boolean;
  city?: string;
}

export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
    );
    const data = await response.json();
    
    return {
      temp: data.current.temperature_2m,
      tempMax: data.daily.temperature_2m_max[0],
      tempMin: data.daily.temperature_2m_min[0],
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      rainProb: data.daily.precipitation_probability_max[0],
      isDay: data.current.is_day === 1
    };
  } catch (error) {
    console.error("Failed to fetch weather", error);
    throw error;
  }
};