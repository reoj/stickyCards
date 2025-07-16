import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StickyCardsComponent } from './sticky-cards/sticky-cards.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StickyCardsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'stickyCards';
}
