import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-education',
  imports: [],
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class Education implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    gsap.from(this.el.nativeElement.querySelectorAll('.edu-card'), {
      scrollTrigger: {
        trigger: this.el.nativeElement.querySelector('.edu-column'),
        start: 'top 80%',
      },
      x: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    gsap.from(this.el.nativeElement.querySelectorAll('.cert-card'), {
      scrollTrigger: {
        trigger: this.el.nativeElement.querySelector('.cert-column'),
        start: 'top 80%',
      },
      x: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      delay: 0.2,
      ease: 'power3.out'
    });
  }
}
