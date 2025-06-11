import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { GENDER_SERVICES, GenderService } from '../../data/services.mock';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.css',
})
export class ServicesPageComponent {
  private router = inject(Router);
  allServices: GenderService[] = GENDER_SERVICES;
  categories: string[] = [
    'All',
    'Gender Support',
    'Mental Health',
    'Lab Test',
    'Legal Support',
    'Education',
  ];
  selectedCategory: string = 'All';
  searchValue: string = '';
  // Pagination
  page = 1;
  perPage = 6;
  get maxPage() {
    return Math.ceil(this.filteredServices.length / this.perPage);
  }
  bookService(sv: GenderService, event?: Event) {
    if (event) event.stopPropagation();
    localStorage.setItem(
      'pre-fill-message',
      `I want to ask about "${sv.name}"`
    );
    this.router.navigate(['/appointment']);
  }
  get filteredServices(): GenderService[] {
    let result = this.allServices;
    if (this.selectedCategory !== 'All') {
      result = result.filter((sv) => sv.category === this.selectedCategory);
    }
    if (this.searchValue) {
      const key = this.searchValue.toLowerCase();
      result = result.filter(
        (sv) =>
          sv.name.toLowerCase().includes(key) ||
          sv.desc.toLowerCase().includes(key)
      );
    }
    return result;
  }
  get pageArray() {
    return Array.from({ length: this.maxPage });
  }

  get paginatedServices() {
    const start = (this.page - 1) * this.perPage;
    return this.filteredServices.slice(start, start + this.perPage);
  }
  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.page = 1;
  }
  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement)?.value ?? '';
    this.searchValue = val;
    this.page = 1;
  }
  goToPage(pg: number) {
    if (pg < 1 || pg > this.maxPage) return;
    this.page = pg;
  }
}
