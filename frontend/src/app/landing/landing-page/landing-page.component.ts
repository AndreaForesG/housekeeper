import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, AfterViewInit {



  constructor(private titleService: Title,
              private route: ActivatedRoute,) { }

  isMenuCollapsed = true;
  images = [
    'assets/movil.png',
    'assets/pc.png',
    'assets/tablet.png',
    'assets/mesa.png',
  ];

  currentIndex = 0;
  intervalId: any;



  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.titleService.setTitle(data.title);
    });
    this.startAutoSlide();

  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  ngAfterViewInit() {
    const video: HTMLVideoElement | null = document.querySelector("video");
    if (video) {
      video.play().catch(err => {
        console.warn("Play error:", err);
      });
    }
  }




}
