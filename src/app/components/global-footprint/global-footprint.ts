import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-global-footprint',
  imports: [],
  templateUrl: './global-footprint.html',
  styleUrl: './global-footprint.scss',
})
export class GlobalFootprint implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const items = this.el.nativeElement.querySelectorAll('.timeline-item');
    items.forEach((item: HTMLElement) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }
}
