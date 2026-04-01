import { Component, AfterViewInit } from '@angular/core';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { GlobalFootprint } from './components/global-footprint/global-footprint';
import { Projects } from './components/projects/projects';
import { Education } from './components/education/education';
import { Footer } from './components/footer/footer';
// @ts-ignore
import VanillaTilt from 'vanilla-tilt';

@Component({
  selector: 'app-root',
  imports: [Hero, About, GlobalFootprint, Projects, Education, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  ngAfterViewInit() {
    setTimeout(() => {
      const cards = document.querySelectorAll('.glass-card');
      // @ts-ignore
      VanillaTilt.init(cards, {
        max: 10,
        speed: 400,
        glare: true,
        'max-glare': 0.1,
        scale: 1.02
      });
    }, 500);
  }
}
