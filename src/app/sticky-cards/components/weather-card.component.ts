import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WeatherCard } from '../models/WeatherCard';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="weather-card" [style.background-color]="card.color">
      <mat-card-header>
        <mat-card-title>{{ card.title }}</mat-card-title>
        <mat-card-subtitle>{{ card.weatherData.location }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="weather-main">
          <div class="temperature">{{ card.weatherData.temperature }}°C</div>
          <div class="condition">{{ card.weatherData.condition }}</div>
        </div>
        <div class="weather-details">
          <div class="detail">
            <mat-icon>water_drop</mat-icon>
            <span>{{ card.weatherData.humidity }}%</span>
          </div>
          <div class="detail">
            <mat-icon>air</mat-icon>
            <span>{{ card.weatherData.windSpeed }} km/h</span>
          </div>
        </div>
        <div class="forecast" *ngIf="card.weatherData.forecast">
          <div class="forecast-item" *ngFor="let day of card.weatherData.forecast">
            <div class="day">{{ day.day }}</div>
            <div class="temps">{{ day.high }}°/{{ day.low }}°</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .weather-card {
      width: 250px;
      height: 300px;
      margin: 8px;
      cursor: move;
    }
    
    .weather-main {
      text-align: center;
      margin-bottom: 16px;
    }
    
    .temperature {
      font-size: 2.5em;
      font-weight: bold;
      color: #fff;
    }
    
    .condition {
      font-size: 1.1em;
      color: #fff;
      opacity: 0.9;
    }
    
    .weather-details {
      display: flex;
      justify-content: space-around;
      margin-bottom: 16px;
    }
    
    .detail {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #fff;
    }
    
    .detail mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .forecast {
      display: flex;
      gap: 8px;
      overflow-x: auto;
    }
    
    .forecast-item {
      min-width: 60px;
      text-align: center;
      color: #fff;
      opacity: 0.9;
    }
    
    .day {
      font-size: 0.8em;
      margin-bottom: 4px;
    }
    
    .temps {
      font-size: 0.9em;
      font-weight: bold;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherCardComponent {
  @Input() card!: WeatherCard;
}
