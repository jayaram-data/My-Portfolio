import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private particles!: THREE.Points;
  private linesMesh!: THREE.LineSegments;
  private animationFrameId!: number;
  private particleCount = 150;
  private maxDist = 30;
  private positions!: Float32Array;
  private velocities: { x: number; y: number; z: number }[] = [];

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.animateGSAP();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) this.renderer.dispose();
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  scrollToAbout(e: Event) {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private animateGSAP() {
    // Setup initial states nicely
    gsap.set('.subtitle, .main-title, .description, .cta-actions', { opacity: 0 });
    gsap.set('.kpi', { opacity: 0 });
    
    // Animate
    gsap.to('.subtitle', { y: 0, scale: 1, opacity: 1, duration: 1, delay: 0.2 });
    gsap.fromTo('.main-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power3.out' });
    gsap.fromTo('.description', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'power2.out' });
    gsap.fromTo('.kpi', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, delay: 0.8 });
    gsap.to('.cta-actions', { opacity: 1, duration: 1, delay: 1.5 });
  }

  private initThreeJS() {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 100;

    // Particles
    const geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
        this.positions[i * 3]     = (Math.random() - 0.5) * 300;
        this.positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
        this.positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

        this.velocities.push({
            x: (Math.random() - 0.5) * 0.3,
            y: (Math.random() - 0.5) * 0.3,
            z: (Math.random() - 0.5) * 0.3
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x00F0FF,
        size: 1.5,
        transparent: true,
        opacity: 0.9,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00F0FF,
        transparent: true,
        opacity: 0.15,
    });
    const lineGeometry = new THREE.BufferGeometry();
    this.linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(this.linesMesh);

    const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);

        let vertexCount = 0;
        const linePositions = [];

        for (let i = 0; i < this.particleCount; i++) {
            this.positions[i * 3] += this.velocities[i].x;
            this.positions[i * 3 + 1] += this.velocities[i].y;
            this.positions[i * 3 + 2] += this.velocities[i].z;

            // Bounce
            if (Math.abs(this.positions[i * 3]) > 150) this.velocities[i].x *= -1;
            if (Math.abs(this.positions[i * 3 + 1]) > 150) this.velocities[i].y *= -1;
            if (Math.abs(this.positions[i * 3 + 2]) > 150) this.velocities[i].z *= -1;

            // Lines checking
            for (let j = i + 1; j < this.particleCount; j++) {
                const dx = this.positions[i * 3] - this.positions[j * 3];
                const dy = this.positions[i * 3 + 1] - this.positions[j * 3 + 1];
                const dz = this.positions[i * 3 + 2] - this.positions[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < this.maxDist * this.maxDist) {
                    linePositions.push(
                        this.positions[i * 3], this.positions[i * 3 + 1], this.positions[i * 3 + 2],
                        this.positions[j * 3], this.positions[j * 3 + 1], this.positions[j * 3 + 2]
                    );
                    vertexCount++;
                }
            }
        }

        this.particles.geometry.attributes['position'].needsUpdate = true;
        this.linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        
        // Add subtle rotation
        this.particles.rotation.y += 0.001;
        this.particles.rotation.x += 0.0005;
        this.linesMesh.rotation.y += 0.001;
        this.linesMesh.rotation.x += 0.0005;

        this.renderer.render(this.scene, this.camera);
    };

    animate();
  }
}
