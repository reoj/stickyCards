import { BaseCard } from './BaseCard';

export interface WeatherCard extends BaseCard {
  type: 'weather';
  weatherData: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    location: string;
    icon: string;
    forecast?: {
      day: string;
      high: number;
      low: number;
      condition: string;
    }[];
  };
}
