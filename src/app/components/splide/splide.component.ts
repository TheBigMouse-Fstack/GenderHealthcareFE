import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Splide from '@splidejs/splide';

@Component({
  selector: 'app-splide',
  templateUrl: './splide.component.html',
  styleUrls: ['./splide.component.css'],
})
export class SplideComponent implements AfterViewInit {
  @ViewChild('splideRef') splideRef!: ElementRef;
  splide: any;

  ngAfterViewInit() {
    this.splide = new Splide(this.splideRef.nativeElement, {
      type: 'loop',
      perPage: 3,
      arrows: false, // Tắt arrow mặc định!
    }).mount();
  }

  prev() {
    this.splide.go('<');
  }

  next() {
    this.splide.go('>');
  }
}
