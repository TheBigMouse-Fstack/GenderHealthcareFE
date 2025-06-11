import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { DOCTORS, Doctor } from '../../data/doctors.mock';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctors-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './doctors-page.component.html',
  styleUrl: './doctors-page.component.css',
})
export class DoctorsPageComponent {
  allDoctors: Doctor[] = DOCTORS;
  searchValue: string = '';
  specialties: string[] = [
    'All',
    ...Array.from(new Set(DOCTORS.map((d) => d.specialty))),
  ];
  selectedSpecialty: string = 'All';
  genders: string[] = ['All', 'Male', 'Female'];
  selectedGender: string = 'All';

  // Pagination
  page = 1;
  perPage = 4;
  get maxPage() {
    return Math.ceil(this.filteredDoctors.length / this.perPage);
  }
  get pageArray() {
    return Array.from({ length: this.maxPage });
  }
  get filteredDoctors() {
    let result = this.allDoctors;
    if (this.selectedSpecialty !== 'All')
      result = result.filter((d) => d.specialty === this.selectedSpecialty);
    if (this.selectedGender !== 'All')
      result = result.filter((d) => d.gender === this.selectedGender);
    if (this.searchValue)
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          d.role.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    return result;
  }
  get paginatedDoctors() {
    const start = (this.page - 1) * this.perPage;
    return this.filteredDoctors.slice(start, start + this.perPage);
  }
  onSearch(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value || '';
    this.page = 1;
  }
  selectSpecialty(spec: string) {
    this.selectedSpecialty = spec;
    this.page = 1;
  }
  selectGender(g: string) {
    this.selectedGender = g;
    this.page = 1;
  }
  goToPage(pg: number) {
    if (pg < 1 || pg > this.maxPage) return;
    this.page = pg;
  }
}
