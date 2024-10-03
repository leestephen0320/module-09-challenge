import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
// ? there are many more parameters, do i need all of them?
interface Coordinates {
  lon: string;
  lat: string;
}

// TODO: Define a class for the Weather object
//! for now, just work with the parameters selected. see bottom of code for full list seperate main for specfitc things
interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  temp: number;
  windSpeed: string;
  humidity: number;
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
  private async fetchLocationData(query: string){
    try {
      const response = await fetch(
        `${this.baseURL}${this.buildGeocodeQuery()}${query}&APPID=${this.apiKey}`
      )

      const locations = await response.json();
      return locations;
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
  //? added some properties, is this ok? probably not
  //! it should get the city inside
  private buildGeocodeQuery(): string {
    let query = `/geo/1.0/direct?q=`;
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
  //? destructure this into Weather object?
  private async fetchAndDestructureLocationData(coordinates: Coordinates) {
    const destructuredLocation = this.destructureLocationData(coordinates);
    return this.buildWeatherQuery(destructuredLocation);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      let query = this.fetchAndDestructureLocationData(coordinates);
      const response = await fetch(
        `${this.baseURL}/data/2.5/forecast?${query}&APPID=${this.apiKey}`
      )

      const weatherRaw = await response.json();
      const weatherData = await this.parseCurrentWeather(weatherRaw.data);
      return weatherData;
    } catch (err) {
      console.log('Error:',err);
      return err;
    }
  }
  // TODO: Build parseCurrentWeather method
  //? 
  private parseCurrentWeather(response: Weather) {
        const weatherObject: Weather = {
          city: response.city,
          date: response.date,
          icon: response.icon,
          iconDescription: response.iconDescription,
          temp: response.temp,
          windSpeed: response.windSpeed,
          humidity: response.humidity,
        };
        return weatherObject;
    // const weatherArray: Weather[] = response.map((weather) => {
    //   const weatherObject: Weather = {
    //     city: weather.city,
    //     date: weather.date,
    //     icon: weather.icon,
    //     iconDescription: weather.iconDescription,
    //     temp: weather.temp,
    //     windSpeed: weather.windSpeed,
    //     humidity: weather.humidity,
    //   };

    //   return weatherObject;
    // });

    // return weatherArray
  }
  // TODO: Complete buildForecastArray method
  //? i feel like i already ran the functionality of this code in the get by running parseCurrentWeather in fetchWeatherData
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    weatherData.map((currentWeather) => 
      this.parseCurrentWeather(currentWeather));
    return weatherData;
  }
  // TODO: Complete getWeatherForCity method
  // the below code seems too easy to be true. I feel like it somehow needs to incorporate all the previous functions
  // something like the following flow
    // use city name to get location data
    // use location data to get weather data
    // put weather data in here
  async getWeatherForCity(city: string) {
    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);
    let weatherArray: any[] = [];
    const cityWeather = await this.buildForecastArray(weatherData,weatherArray);
    return cityWeather;
}
}

export default new WeatherService();
/*
cod Internal parameter
message Internal parameter
cntA number of timestamps returned in the API response
list
list.dt Time of data forecasted, unix, UTC
list.main
list.main.temp Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.feels_like This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.temp_min Minimum temperature at the moment of calculation. This is minimal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info here. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.temp_max Maximum temperature at the moment of calculation. This is maximal forecasted temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info here. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
list.main.pressure Atmospheric pressure on the sea level by default, hPa
list.main.sea_level Atmospheric pressure on the sea level, hPa
list.main.grnd_level Atmospheric pressure on the ground level, hPa
list.main.humidity Humidity, %
list.main.temp_kf Internal parameter
list.weather
list.weather.id Weather condition id
list.weather.main Group of weather parameters (Rain, Snow, Clouds etc.)
list.weather.description Weather condition within the group. Please find more here. You can get the output in your language. Learn more
list.weather.icon Weather icon id
list.clouds
list.clouds.all Cloudiness, %
list.wind
list.wind.speed Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
list.wind.deg Wind direction, degrees (meteorological)
list.wind.gust Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
list.visibility Average visibility, metres. The maximum value of the visibility is 10km
list.pop Probability of precipitation. The values of the parameter vary between 0 and 1, where 0 is equal to 0%, 1 is equal to 100%
list.rain
list.rain.3h Rain volume for last 3 hours, mm. Please note that only mm as units of measurement are available for this parameter
list.snow
list.snow.3h Snow volume for last 3 hours. Please note that only mm as units of measurement are available for this parameter
list.sys
list.sys.pod Part of the day (n - night, d - day)
list.dt_txt Time of data forecasted, ISO, UTC
city
city.id City ID. Please note that built-in geocoder functionality has been deprecated. Learn more here
city.name City name. Please note that built-in geocoder functionality has been deprecated. Learn more here
city.coord
city.coord.lat Geo location, latitude
city.coord.lon Geo location, longitude
city.country Country code (GB, JP etc.). Please note that built-in geocoder functionality has been deprecated. Learn more here
city.population City population
city.timezone Shift in seconds from UTC
city.sunrise Sunrise time, Unix, UTC
city.sunset Sunset time, Unix, UTC
*/