/**
 * Tools Service: Free Public APIs with client-side execution & Gemini Tool Schema definitions
 */

// Helper: Weather code interpreter
function decodeWeatherCode(code) {
  const codes = {
    0: 'Clear sky ☀️',
    1: 'Mainly clear 🌤️',
    2: 'Partly cloudy ⛅',
    3: 'Overcast ☁️',
    45: 'Foggy 🌫️',
    48: 'Depositing rime fog 🌫️',
    51: 'Light drizzle 🌧️',
    53: 'Moderate drizzle 🌧️',
    55: 'Dense drizzle 🌧️',
    61: 'Slight rain 🌧️',
    63: 'Moderate rain 🌧️',
    65: 'Heavy rain 🌧️',
    71: 'Slight snow 🌨️',
    73: 'Moderate snow 🌨️',
    75: 'Heavy snow 🌨️',
    77: 'Snow grains 🌨️',
    80: 'Slight rain showers 🌦️',
    81: 'Moderate rain showers 🌦️',
    82: 'Violent rain showers ⛈️',
    95: 'Thunderstorm ⛈️',
    96: 'Thunderstorm with slight hail ⛈️',
    99: 'Thunderstorm with heavy hail ⛈️',
  };
  return codes[code] || `Code ${code} (Unspecified Weather)`;
}

// Helper: AQI status category
function getAqiCategory(aqi) {
  if (aqi <= 50) return { category: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  if (aqi <= 100) return { category: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' };
  if (aqi <= 150) return { category: 'Unhealthy for Sensitive Groups', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
  if (aqi <= 200) return { category: 'Unhealthy', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
  return { category: 'Hazardous', color: 'text-red-600', bg: 'bg-red-600/20 border-red-600/40' };
}

/**
 * Tool 1: Geocoding (Open-Meteo Geocoding API)
 */
export async function fetchGeocoding(city) {
  if (!city || typeof city !== 'string') {
    throw new Error('City parameter is required and must be a string.');
  }
  const cleanCity = city.trim();
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=5&language=en&format=json`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocoding API HTTP error ${res.status}`);
  }
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    return {
      status: 'not_found',
      message: `No geographical coordinates found for '${city}'.`,
      city: cleanCity
    };
  }
  const bestMatch = data.results[0];
  return {
    status: 'success',
    city: cleanCity,
    name: bestMatch.name,
    latitude: bestMatch.latitude,
    longitude: bestMatch.longitude,
    country: bestMatch.country,
    country_code: bestMatch.country_code,
    admin1: bestMatch.admin1 || '',
    timezone: bestMatch.timezone,
    elevation_meters: bestMatch.elevation,
    population: bestMatch.population,
    alternative_matches: data.results.slice(1).map(r => ({
      name: r.name,
      country: r.country,
      latitude: r.latitude,
      longitude: r.longitude
    }))
  };
}

/**
 * Tool 2: Weather (Open-Meteo Weather API)
 */
export async function fetchWeather(latitude, longitude, location_name = '') {
  if (latitude == null || longitude == null) {
    throw new Error('Latitude and Longitude parameters are required.');
  }
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API HTTP error ${res.status}`);
  }
  const data = await res.json();
  const curr = data.current || {};
  const daily = data.daily || {};

  return {
    status: 'success',
    location: location_name || `Lat ${latitude}, Lon ${longitude}`,
    latitude,
    longitude,
    timezone: data.timezone,
    elevation: data.elevation,
    current_weather: {
      temperature_celsius: curr.temperature_2m,
      temperature_fahrenheit: Number(((curr.temperature_2m * 9/5) + 32).toFixed(1)),
      feels_like_celsius: curr.apparent_temperature,
      feels_like_fahrenheit: Number(((curr.apparent_temperature * 9/5) + 32).toFixed(1)),
      humidity_percent: curr.relative_humidity_2m,
      wind_speed_kmh: curr.wind_speed_10m,
      precipitation_mm: curr.precipitation,
      condition: decodeWeatherCode(curr.weather_code),
      weather_code: curr.weather_code
    },
    forecast_3day: (daily.time || []).slice(0, 3).map((date, idx) => ({
      date,
      max_temp_c: daily.temperature_2m_max?.[idx],
      min_temp_c: daily.temperature_2m_min?.[idx],
      precipitation_mm: daily.precipitation_sum?.[idx]
    }))
  };
}

/**
 * Tool 3: Air Quality (Open-Meteo Air Quality API)
 */
export async function fetchAirQuality(latitude, longitude, location_name = '') {
  if (latitude == null || longitude == null) {
    throw new Error('Latitude and Longitude parameters are required.');
  }
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Air Quality API HTTP error ${res.status}`);
  }
  const data = await res.json();
  const curr = data.current || {};
  const usAqi = curr.us_aqi ?? 'N/A';
  const aqiCategoryInfo = typeof usAqi === 'number' ? getAqiCategory(usAqi) : { category: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-800' };

  return {
    status: 'success',
    location: location_name || `Lat ${latitude}, Lon ${longitude}`,
    latitude,
    longitude,
    air_quality_index_us: usAqi,
    health_category: aqiCategoryInfo.category,
    pollutants: {
      pm2_5_ug_m3: curr.pm2_5,
      pm10_ug_m3: curr.pm10,
      nitrogen_dioxide_ug_m3: curr.nitrogen_dioxide,
      sulphur_dioxide_ug_m3: curr.sulphur_dioxide,
      ozone_ug_m3: curr.ozone,
      carbon_monoxide_ug_m3: curr.carbon_monoxide
    }
  };
}

/**
 * Tool 4: Currency Exchange (Frankfurter API)
 */
export async function fetchCurrency(amount = 1, from_currency = 'USD', to_currency = '') {
  const baseCurrency = (from_currency || 'USD').toUpperCase().trim();
  let url = `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${baseCurrency}`;
  
  if (to_currency && typeof to_currency === 'string' && to_currency.trim()) {
    const targetCodes = to_currency.toUpperCase().trim();
    url += `&to=${targetCodes}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Currency code '${from_currency}' or target currency is invalid or unsupported by Frankfurter API.`);
    }
    throw new Error(`Frankfurter Currency API HTTP error ${res.status}`);
  }
  const data = await res.json();
  
  // Calculate unit exchange rates for transparency
  const rates = data.rates || {};
  const conversions = {};
  for (const [currCode, convertedVal] of Object.entries(rates)) {
    conversions[currCode] = {
      converted_amount: convertedVal,
      rate_per_unit: Number((convertedVal / (amount || 1)).toFixed(4))
    };
  }

  return {
    status: 'success',
    amount_input: amount,
    base_currency: data.base,
    date: data.date,
    conversions: conversions
  };
}

/**
 * Tool 5: Earthquakes (USGS API)
 */
export async function fetchEarthquakes(min_magnitude = 4.0, days_back = 3, limit = 5) {
  const now = new Date();
  const startDate = new Date(now.getTime() - (days_back * 24 * 60 * 60 * 1000));
  const isoStartDate = startDate.toISOString().split('T')[0];

  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${isoStartDate}&minmagnitude=${min_magnitude}&limit=${limit}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`USGS Earthquake API HTTP error ${res.status}`);
  }
  const data = await res.json();
  const features = data.features || [];

  const earthquakeList = features.map(item => {
    const props = item.properties || {};
    const geom = item.geometry || {};
    const coords = geom.coordinates || []; // [longitude, latitude, depth_km]
    return {
      title: props.title,
      magnitude: props.mag,
      place: props.place,
      time: props.time ? new Date(props.time).toLocaleString() : 'Unknown',
      latitude: coords[1],
      longitude: coords[0],
      depth_km: coords[2],
      alert_level: props.alert || 'green',
      tsunami_warning: props.tsunami === 1,
      usgs_url: props.url
    };
  });

  return {
    status: 'success',
    search_criteria: {
      min_magnitude,
      days_back,
      start_date: isoStartDate,
      total_returned: earthquakeList.length
    },
    earthquakes: earthquakeList
  };
}

/**
 * Master Registry mapping tool names to actual JavaScript async functions
 */
export const TOOL_HANDLER_MAP = {
  get_coordinates: async (args) => await fetchGeocoding(args.city),
  get_weather: async (args) => await fetchWeather(args.latitude, args.longitude, args.location_name),
  get_air_quality: async (args) => await fetchAirQuality(args.latitude, args.longitude, args.location_name),
  convert_currency: async (args) => await fetchCurrency(args.amount ?? 1, args.from_currency, args.to_currency),
  get_recent_earthquakes: async (args) => await fetchEarthquakes(args.min_magnitude ?? 4.0, args.days_back ?? 3, args.limit ?? 5)
};

/**
 * Tool Metadata for Documentation & Display
 */
export const METADATA_TOOLS = [
  {
    id: 'get_coordinates',
    name: 'Open-Meteo Geocoding',
    apiProvider: 'Open-Meteo',
    requiresKey: false,
    category: 'Geographic Location',
    difficulty: 'Very Easy',
    iconName: 'MapPin',
    color: 'emerald',
    endpoint: 'https://geocoding-api.open-meteo.com/v1/search',
    description: 'Resolves any city name, region, or landmark into exact geographical coordinates (latitude and longitude), country details, timezone, and population.',
    parameters: [
      { name: 'city', type: 'string', required: true, description: 'City or place name (e.g., "Tokyo", "London", "San Francisco")' }
    ],
    sampleArgs: { city: 'Tokyo' }
  },
  {
    id: 'get_weather',
    name: 'Open-Meteo Weather',
    apiProvider: 'Open-Meteo',
    requiresKey: false,
    category: 'Meteorology',
    difficulty: 'Very Easy',
    iconName: 'SunCloud',
    color: 'amber',
    endpoint: 'https://api.open-meteo.com/v1/forecast',
    description: 'Retrieves current weather metrics (temperature, humidity, wind speed, precipitation, weather conditions) and 3-day forecasts for given coordinates.',
    parameters: [
      { name: 'latitude', type: 'number', required: true, description: 'Latitude coordinate (-90 to 90)' },
      { name: 'longitude', type: 'number', required: true, description: 'Longitude coordinate (-180 to 180)' },
      { name: 'location_name', type: 'string', required: false, description: 'Optional city/location label' }
    ],
    sampleArgs: { latitude: 35.6762, longitude: 139.6503, location_name: 'Tokyo' }
  },
  {
    id: 'get_air_quality',
    name: 'Open-Meteo Air Quality',
    apiProvider: 'Open-Meteo',
    requiresKey: false,
    category: 'Environmental Science',
    difficulty: 'Very Easy',
    iconName: 'Wind',
    color: 'teal',
    endpoint: 'https://air-quality-api.open-meteo.com/v1/air-quality',
    description: 'Fetches real-time US Air Quality Index (AQI), health assessment category, and concentration of PM2.5, PM10, NO2, O3, and SO2 pollutants.',
    parameters: [
      { name: 'latitude', type: 'number', required: true, description: 'Latitude coordinate' },
      { name: 'longitude', type: 'number', required: true, description: 'Longitude coordinate' },
      { name: 'location_name', type: 'string', required: false, description: 'Optional location label' }
    ],
    sampleArgs: { latitude: 37.7749, longitude: -122.4194, location_name: 'San Francisco' }
  },
  {
    id: 'convert_currency',
    name: 'Frankfurter Exchange Rates',
    apiProvider: 'Frankfurter Dev',
    requiresKey: false,
    category: 'Financial Data',
    difficulty: 'Very Easy',
    iconName: 'DollarSign',
    color: 'indigo',
    endpoint: 'https://api.frankfurter.dev/v1/latest',
    description: 'Converts financial amounts between international fiat currencies using live European Central Bank exchange rates.',
    parameters: [
      { name: 'amount', type: 'number', required: false, description: 'Amount to convert (default 1)' },
      { name: 'from_currency', type: 'string', required: true, description: 'Base 3-letter currency code (e.g., USD, EUR, GBP, JPY)' },
      { name: 'to_currency', type: 'string', required: false, description: 'Target 3-letter currency code or comma-separated list' }
    ],
    sampleArgs: { amount: 100, from_currency: 'USD', to_currency: 'EUR,GBP,JPY' }
  },
  {
    id: 'get_recent_earthquakes',
    name: 'USGS Earthquake Hazards',
    apiProvider: 'USGS',
    requiresKey: false,
    category: 'Geophysics & Seismology',
    difficulty: 'Very Easy',
    iconName: 'Activity',
    color: 'rose',
    endpoint: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
    description: 'Queries global seismic activity logs from the United States Geological Survey, filtered by minimum magnitude, depth, and timeframe.',
    parameters: [
      { name: 'min_magnitude', type: 'number', required: false, description: 'Minimum Richter scale magnitude (e.g. 4.0)' },
      { name: 'days_back', type: 'number', required: false, description: 'Lookback window in days (e.g. 3)' },
      { name: 'limit', type: 'number', required: false, description: 'Maximum seismic events to retrieve (default 5)' }
    ],
    sampleArgs: { min_magnitude: 4.5, days_back: 3, limit: 5 }
  }
];

/**
 * Gemini Tool Schema Declarations
 */
export const GEMINI_TOOLS_DECLARATION = [
  {
    functionDeclarations: [
      {
        name: "get_coordinates",
        description: "Convert a city or location name into latitude and longitude coordinates. MUST be called first if user asks for weather/air quality of a named location.",
        parameters: {
          type: "OBJECT",
          properties: {
            city: { type: "STRING", description: "City or location name, e.g. 'Tokyo', 'Paris', 'New York'" }
          },
          required: ["city"]
        }
      },
      {
        name: "get_weather",
        description: "Get weather details (temperature, humidity, wind, 3-day forecast) using latitude and longitude coordinates.",
        parameters: {
          type: "OBJECT",
          properties: {
            latitude: { type: "NUMBER", description: "Latitude coordinate" },
            longitude: { type: "NUMBER", description: "Longitude coordinate" },
            location_name: { type: "STRING", description: "Name of the location for context" }
          },
          required: ["latitude", "longitude"]
        }
      },
      {
        name: "get_air_quality",
        description: "Get Air Quality Index (US AQI) and pollutant levels (PM2.5, PM10, NO2, O3) for latitude and longitude coordinates.",
        parameters: {
          type: "OBJECT",
          properties: {
            latitude: { type: "NUMBER", description: "Latitude coordinate" },
            longitude: { type: "NUMBER", description: "Longitude coordinate" },
            location_name: { type: "STRING", description: "Name of the location for context" }
          },
          required: ["latitude", "longitude"]
        }
      },
      {
        name: "convert_currency",
        description: "Convert currency amount or retrieve latest exchange rates between currencies (e.g. USD, EUR, GBP, JPY, INR).",
        parameters: {
          type: "OBJECT",
          properties: {
            amount: { type: "NUMBER", description: "Amount of money to convert (default 1)" },
            from_currency: { type: "STRING", description: "Source currency 3-letter code (e.g. 'USD')" },
            to_currency: { type: "STRING", description: "Target currency code or codes (e.g. 'EUR' or 'EUR,GBP')" }
          },
          required: ["from_currency"]
        }
      },
      {
        name: "get_recent_earthquakes",
        description: "Retrieve recent seismic events from USGS database filtered by magnitude and date range.",
        parameters: {
          type: "OBJECT",
          properties: {
            min_magnitude: { type: "NUMBER", description: "Minimum earthquake magnitude (e.g. 4.0)" },
            days_back: { type: "NUMBER", description: "Days back to search (e.g. 3)" },
            limit: { type: "NUMBER", description: "Max number of events to return" }
          }
        }
      }
    ]
  }
];
