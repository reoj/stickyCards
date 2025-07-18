import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WeatherCard } from '../models/WeatherCard';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // Mock weather data - in a real app, you'd call a weather API
  getWeatherData(): Observable<WeatherCard[]> {
    const mockWeatherCards: WeatherCard[] = [
      {
        id: 1001,
        title: 'Current Weather',
        color: '#2196f3',
        type: 'weather',
        position: { x: 0, y: 0 },
        createdAt: new Date(),
        updatedAt: new Date(),
        weatherData: {
          temperature: 22,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          location: 'New York, NY',
          icon: 'partly_cloudy_day',
          forecast: [
            { day: 'Today', high: 25, low: 18, condition: 'Sunny' },
            { day: 'Tomorrow', high: 23, low: 16, condition: 'Cloudy' },
            { day: 'Friday', high: 20, low: 14, condition: 'Rainy' },
          ],
        },
      },
    ];

    return of(mockWeatherCards);
  }
}
