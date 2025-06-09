import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, SearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isSearch = false;
  isActive = false;
  isMenuOpen = false;
  isUserMenuOpen = false;

  isSearchHandle(val: boolean) {
    this.isSearch = val;
  }
  closeSearch() {
    this.isSearch = false;
  }
  openMenu() {
    this.isMenuOpen = true;
  }
  closeMenu() {
    this.isMenuOpen = false;
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleHamburger() {
    this.isActive = !this.isActive;
  }
}
