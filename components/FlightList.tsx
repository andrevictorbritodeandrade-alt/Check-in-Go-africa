
import React from 'react';
import { 
  Plane, 
  PlaneTakeoff, 
  PlaneLanding, 
  Clock, 
  MapPin, 
  Users, 
  Luggage, 
  CreditCard, 
  CloudSun, 
  ThermometerSun, 
  Droplets, 
  Calendar,
  AlertCircle,
  QrCode,
  Info,
  BellRing
} from 'lucide-react';

// Interfaces for our specific data structure
interface Passenger {
  name: string;
  ticketNumber?: string;
  doc?: string;
  cpf?: string;
}

interface WeatherForecast {
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  rainProb: number;
  condition: string;
}

interface FlightLeg {
  flightNumber: string;
  airline: string;
  aircraft?: string;
  departure: {
    code: string;
    city: string;
    time: string; // Local time
    date: string;
    brasiliaTime?: string; // Calculated manually for display
  };
  arrival: {
    code: string;
    city: string;
    time: string; // Local time
    date: string;
    brasiliaTime?: string;
  };
  duration: string;
  layover?: string;
  checkInTime?: string;
  weatherDeparture?: WeatherForecast;
  weatherArrival?: WeatherForecast;
}

interface Trip {
  id: string;
  type: 'ida' | 'volta' | 'interno';
  title: string;
  bookingReference: string;
  provider: string; // Decolar or MyTrip
  passengers: Passenger[];
  legs: FlightLeg[];
  baggage: string;
  financials?: {
    total: string;
    installments?: string;
    status: string;
  };
}

// MOCKED WEATHER DATA (Updated Historical Averages for Jan/Feb Summer 2026)
const WEATHER_SP: WeatherForecast = { tempMax: 28, tempMin: 20, feelsLike: 31, humidity: 82, rainProb: 65, condition: "Chuvas de Verão" };
const WEATHER_JNB: WeatherForecast = { tempMax: 26, tempMin: 15, feelsLike: 28, humidity: 60, rainProb: 45, condition: "Tempestades à Tarde" };
const WEATHER_CPT: WeatherForecast = { tempMax: 27, tempMin: 16, feelsLike: 27, humidity: 55, rainProb: 5, condition: "Ensolarado e Ventoso" };
const WEATHER_LAD: WeatherForecast = { tempMax: 32, tempMin: 24, feelsLike: 38, humidity: 85, rainProb: 30, condition: "Muito Quente e Úmido" };

// DATA EXTRACTED FROM PDFS AND SCREENSHOTS
const TRIPS: Trip[] = [
  {
    id: 'int-ida',
    type: 'ida',
    title: 'Ida: Brasil → África do Sul',
    bookingReference: '862508329300',
    provider: 'Decolar / TAAG',
    baggage: '2 malas despachadas por adulto + Bagagem de mão',
    passengers: [
      { name: 'André Victor Brito de Andrade', ticketNumber: '1186055770451', cpf: '126.669.667-98' },
      { name: 'Marcelly Bispo Pereira da Silva', ticketNumber: '1186055770450', cpf: '140.192.717-39' }
    ],
    legs: [
      {
        flightNumber: 'DT 748',
        airline: 'TAAG Angola Airlines',
        checkInTime: '14:05 (Recomendado)',
        departure: { code: 'GRU', city: 'São Paulo', time: '18:05', date: '25/Jan/26', brasiliaTime: '18:05' },
        arrival: { code: 'NBJ', city: 'Luanda', time: '06:40', date: '26/Jan/26', brasiliaTime: '02:40' }, // LAD is UTC+1 (4h ahead of BR)
        duration: '8h 35m',
        layover: 'Conexão: 3h 15m em Luanda (Troca de avião)',
        weatherDeparture: WEATHER_SP,
        weatherArrival: WEATHER_LAD
      },
      {
        flightNumber: 'DT 577',
        airline: 'TAAG Angola Airlines',
        departure: { code: 'NBJ', city: 'Luanda', time: '09:55', date: '26/Jan/26', brasiliaTime: '05:55' },
        arrival: { code: 'JNB', city: 'Joanesburgo', time: '14:40', date: '26/Jan/26', brasiliaTime: '09:40' }, // JNB is UTC+2 (5h ahead of BR)
        duration: '3h 45m',
        weatherDeparture: WEATHER_LAD,
        weatherArrival: WEATHER_JNB
      }
    ]
  },
  {
    id: 'dom-ida',
    type: 'interno',
    title: 'Interno: Joanesburgo → Cidade do Cabo',
    bookingReference: '1108-387-389',
    provider: 'MyTrip / South African Airways',
    baggage: 'Franquia Econômica Padrão',
    financials: {
      total: 'R$ 1.568,97',
      installments: 'Parcelado (Generic IBE installments: R$ 92,92)',
      status: 'Pago'
    },
    passengers: [
      { name: 'André Victor Brito de Andrade', cpf: '126.669.667-98' },
      { name: 'Marcelly Bispo Pereira da Silva', cpf: '140.192.717-39' }
    ],
    legs: [
      {
        flightNumber: 'SA 363',
        airline: 'South African Airways (Operado por XQ)',
        checkInTime: '16:45 (2h antes)',
        departure: { code: 'JNB', city: 'Joanesburgo', time: '18:45', date: '26/Jan/26', brasiliaTime: '13:45' }, // SA is UTC+2, BR is UTC-3 (5h diff)
        arrival: { code: 'CPT', city: 'Cidade do Cabo', time: '21:00', date: '26/Jan/26', brasiliaTime: '16:00' },
        duration: '2h 15m',
        weatherDeparture: WEATHER_JNB,
        weatherArrival: WEATHER_CPT
      }
    ]
  },
  {
    id: 'dom-volta',
    type: 'interno',
    title: 'Interno: Cidade do Cabo → Joanesburgo',
    bookingReference: '1108-387-389',
    provider: 'MyTrip / South African Airways',
    baggage: 'Franquia Econômica Padrão',
    passengers: [
      { name: 'André Victor Brito de Andrade', cpf: '126.669.667-98' },
      { name: 'Marcelly Bispo Pereira da Silva', cpf: '140.192.717-39' }
    ],
    legs: [
      {
        flightNumber: 'SA 372',
        airline: 'South African Airways',
        checkInTime: '18:25 (2h antes)',
        departure: { code: 'CPT', city: 'Cidade do Cabo', time: '20:25', date: '31/Jan/26', brasiliaTime: '15:25' },
        arrival: { code: 'JNB', city: 'Joanesburgo', time: '22:25', date: '31/Jan/26', brasiliaTime: '17:25' },
        duration: '2h 00m',
        weatherDeparture: WEATHER_CPT,
        weatherArrival: WEATHER_JNB
      }
    ]
  },
  {
    id: 'int-volta',
    type: 'volta',
    title: 'Volta: África do Sul → Brasil',
    bookingReference: '862508329300',
    provider: 'Decolar / TAAG',
    baggage: '2 malas despachadas por adulto + Bagagem de mão',
    passengers: [
      { name: 'André Victor Brito de Andrade', ticketNumber: '1186055770451', cpf: '126.669.667-98' },
      { name: 'Marcelly Bispo Pereira da Silva', ticketNumber: '1186055770450', cpf: '140.192.717-39' }
    ],
    legs: [
      {
        flightNumber: 'DT 576',
        airline: 'TAAG Angola Airlines',
        checkInTime: '21:45 (do dia anterior)',
        departure: { code: 'JNB', city: 'Joanesburgo', time: '00:45', date: '06/Fev/26', brasiliaTime: '19:45 (05/Fev)' },
        arrival: { code: 'NBJ', city: 'Luanda', time: '03:30', date: '06/Fev/26', brasiliaTime: '23:30 (05/Fev)' },
        duration: '3h 45m',
        layover: 'Conexão: 7h 05m em Luanda (Longo tempo de espera)',
        weatherDeparture: WEATHER_JNB,
        weatherArrival: WEATHER_LAD
      },
      {
        flightNumber: 'DT 747',
        airline: 'TAAG Angola Airlines',
        departure: { code: 'NBJ', city: 'Luanda', time: '10:35', date: '06/Fev/26', brasiliaTime: '06:35' },
        arrival: { code: 'GRU', city: 'São Paulo', time: '15:05', date: '06/Fev/26', brasiliaTime: '15:05' },
        duration: '8h 30m',
        weatherDeparture: WEATHER_LAD,
        weatherArrival: WEATHER_SP
      }
    ]
  }
];

const WeatherWidget: React.FC<{ weather: WeatherForecast, label: string }> = ({ weather, label }) => (
  <div className="bg-white/50 rounded-lg p-2 text-xs flex flex-col items-center border border-gray-100 min-w-[80px]">
    <span className="font-bold text-gray-500 mb-1">{label}</span>
    <div className="flex items-center gap-1 mb-1">
      {weather.rainProb > 40 ? <Droplets className="w-4 h-4 text-blue-500" /> : <CloudSun className="w-4 h-4 text-amber-500" />}
      <span className="font-bold text-lg">{weather.tempMax}°</span>
    </div>
    <div className="flex flex-col gap-0.5 w-full text-[10px] text-gray-600">
      <div className="flex justify-between">
        <span>Min:</span> <span className="font-medium">{weather.tempMin}°</span>
      </div>
      <div className="flex justify-between text-orange-600">
        <ThermometerSun className="w-3 h-3" /> <span className="font-medium">{weather.feelsLike}°</span>
      </div>
      <div className="flex justify-between text-blue-600">
        <Droplets className="w-3 h-3" /> <span className="font-medium">{weather.rainProb}%</span>
      </div>
    </div>
  </div>
);

const FlightList: React.FC = () => {
  return (
    <div className="space-y-6">
      {TRIPS.map((trip) => (
        <div 
          key={trip.id} 
          className={`rounded-3xl border-2 overflow-hidden shadow-sm transition-all ${
            trip.type === 'ida' ? 'bg-blue-50 border-blue-200' : 
            trip.type === 'volta' ? 'bg-orange-50 border-orange-200' : 
            'bg-gray-50 border-gray-200'
          }`}
        >
          {/* Header Card */}
          <div className={`p-4 border-b border-dashed ${
            trip.type === 'ida' ? 'border-blue-200 bg-blue-100/50' : 
            trip.type === 'volta' ? 'border-orange-200 bg-orange-100/50' : 
            'border-gray-200 bg-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                trip.type === 'ida' ? 'bg-blue-600 text-white' : 
                trip.type === 'volta' ? 'bg-orange-500 text-white' : 
                'bg-gray-600 text-white'
              }`}>
                {trip.type === 'ida' ? 'Decolagem / Ida' : trip.type === 'volta' ? 'Retorno / Volta' : 'Voo Interno'}
              </span>
              <span className="font-mono font-bold text-xs text-gray-500">REF: {trip.bookingReference}</span>
            </div>
            <h3 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
              {trip.type === 'ida' ? <PlaneTakeoff className="text-blue-600" /> : <PlaneLanding className="text-orange-600" />}
              {trip.title}
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1 ml-8">Operado por: {trip.provider}</p>
          </div>

          {/* Legs */}
          <div className="p-4 space-y-6">
            {trip.legs.map((leg, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-dashed border-gray-300">
                {/* Decoration Dot */}
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-green-500"></div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded mr-2">{leg.airline}</span>
                      <span className="text-xs font-bold text-gray-500">{leg.flightNumber}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Duração: {leg.duration}
                    </div>
                  </div>
                </div>

                {/* VISUAL CHECK-IN ALERT */}
                <div className="mt-3 mb-5 bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl shadow-sm flex items-start gap-3">
                    <div className="bg-amber-100 p-1.5 rounded-full shrink-0 mt-0.5">
                      <BellRing className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-amber-800 uppercase tracking-wide mb-0.5">Lembrete de Check-in</span>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            Horário de abertura: <strong className="text-amber-900 bg-amber-100 px-1 rounded border border-amber-200/50">{leg.checkInTime || '3h antes do voo'}</strong>.
                            <br/><span className="opacity-80">Recomendamos fazer online para garantir assentos juntos.</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center mb-4">
                  {/* Departure */}
                  <div className="text-left">
                    <p className="text-2xl font-display font-black text-slate-800">{leg.departure.code}</p>
                    <p className="text-xs font-bold text-gray-600">{leg.departure.time}</p>
                    <p className="text-[10px] text-gray-500">{leg.departure.date}</p>
                    {leg.departure.brasiliaTime && leg.departure.brasiliaTime !== leg.departure.time && (
                      <p className="text-[10px] text-blue-600 font-bold mt-1 bg-blue-50 inline-block px-1 rounded">BR: {leg.departure.brasiliaTime}</p>
                    )}
                  </div>

                  {/* Icon */}
                  <div className="flex flex-col items-center">
                    <Plane className="w-5 h-5 text-gray-300 rotate-90" />
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <p className="text-2xl font-display font-black text-slate-800">{leg.arrival.code}</p>
                    <p className="text-xs font-bold text-gray-600">{leg.arrival.time}</p>
                    <p className="text-[10px] text-gray-500">{leg.arrival.date}</p>
                    {leg.arrival.brasiliaTime && leg.arrival.brasiliaTime !== leg.arrival.time && (
                      <p className="text-[10px] text-blue-600 font-bold mt-1 bg-blue-50 inline-block px-1 rounded">BR: {leg.arrival.brasiliaTime}</p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-100 mb-2 grid grid-cols-2 gap-2">
                   <div>
                       <strong className="text-gray-700 block mb-0.5">Embarque</strong> 
                       {leg.departure.city}
                   </div>
                   <div>
                       <strong className="text-gray-700 block mb-0.5">Desembarque</strong> 
                       {leg.arrival.city}
                   </div>
                </div>

                {/* Weather Forecast Section */}
                {(leg.weatherDeparture || leg.weatherArrival) && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {leg.weatherDeparture && <WeatherWidget weather={leg.weatherDeparture} label={`Tempo em ${leg.departure.code}`} />}
                    {leg.weatherArrival && <WeatherWidget weather={leg.weatherArrival} label={`Tempo em ${leg.arrival.code}`} />}
                  </div>
                )}

                {/* Layover Alert */}
                {leg.layover && (
                  <div className="mt-3 flex items-start gap-2 bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-800 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold block mb-0.5">Conexão / Escala</span>
                        <span>{leg.layover}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* QR Code & Check-in Info */}
          <div className="bg-gray-50 p-4 border-t border-gray-200">
             <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 shrink-0">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${trip.bookingReference}`} 
                        alt="QR Code da Reserva" 
                        className="w-24 h-24 mix-blend-multiply opacity-90"
                    />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <QrCode className="w-4 h-4 text-green-700" />
                        <span className="text-sm font-bold text-gray-800">Código de Reserva</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                        Use este QR code nos totens do aeroporto para imprimir etiquetas e cartões de embarque.
                    </p>
                    <div className="inline-flex items-start gap-1.5 bg-blue-50 text-blue-700 p-2 rounded-lg text-[10px] leading-tight text-left">
                        <Info className="w-3 h-3 shrink-0 mt-0.5" />
                        <span>
                            <strong>Nota:</strong> O QR Code oficial de <em>embarque</em> é gerado apenas após o check-in online.
                        </span>
                    </div>
                </div>
             </div>
          </div>

          {/* Footer Info */}
          <div className="bg-white p-4 border-t border-gray-100 text-xs space-y-3">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="w-full">
                <p className="font-bold text-gray-700 mb-1">Passageiros:</p>
                <div className="space-y-2">
                    {trip.passengers.map((p, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                        <div>
                            <p className="font-medium text-gray-600">{p.name}</p>
                            {p.ticketNumber && <span className="block text-[10px] text-gray-400">TKT: {p.ticketNumber}</span>}
                        </div>
                        {p.cpf && (
                            <div className="text-right">
                                <span className="block text-[10px] uppercase font-bold text-gray-400">CPF</span>
                                <span className="font-mono font-medium text-gray-600">{p.cpf}</span>
                            </div>
                        )}
                    </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Luggage className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{trip.baggage}</span>
            </div>

            {trip.financials && (
              <div className="flex items-start gap-2 bg-green-50 p-2 rounded-lg border border-green-100">
                <CreditCard className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-bold text-green-800">Custo Total: {trip.financials.total}</p>
                  {trip.financials.installments && <p className="text-green-700">{trip.financials.installments}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlightList;
