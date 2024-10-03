import fs from 'node:fs/promises';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lon: string;
  lat: string;
}

// TODO: Define a class for the Weather object
interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;

  private apiKey?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/reverse?${query}&APPID=${this.apiKey}`
      )

      const locations = await response.json();
      const LocationData = await this.destructureLocationData(locations.data);
      return LocationData;
    } catch (err) {
      console.log('Error:',err);
      return err;
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const locationObject: Coordinates = {
      lon: locationData.lon,
      lat: locationData.lat,
    };

    return locationObject;
  }
  // TODO: Create buildGeocodeQuery method
  //? I feel like this part of the code should take some inputs, but it doesn't?
  //? added some properties, is this ok?
  private buildGeocodeQuery(coordinates: Coordinates): string {
    let lat = coordinates.lat;
    let lon = coordinates.lon;
    let query = `lat=${lat}&lon=${lon}`;
    return query;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    let lat = this.destructureLocationData(coordinates).lat;
    let lon = this.destructureLocationData(coordinates).lon;
    let query = `lat=${lat}&lon=${lon}`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(coordinates: Coordinates) {
    return this.fetchLocationData(this.buildGeocodeQuery(coordinates));
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      
      const response = await fetch(
        `${this.baseURL}/data/2.5/forecast?${query}&APPID=${this.apiKey}`
      )

      const locations = await response.json();
      const LocationData = await this.destructureLocationData(locations.data);
      return LocationData;
    } catch (err) {
      console.log('Error:',err);
      return err;
    }
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
