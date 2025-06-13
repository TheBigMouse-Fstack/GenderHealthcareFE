import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../Services/supabase.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

interface Doctor {
  id: number;
  name: string;
  role: string;
  gender: string;
  specialty: string;
  img: string;
}

@Component({
  selector: 'app-doctors-page',
  templateUrl: './doctors-page.component.html',
  styleUrls: ['./doctors-page.component.css'],
  imports: [FooterComponent, HeaderComponent, FormsModule, RouterLink, NgClass],
  // standalone và imports nếu bạn xài standalone (tuỳ setup)
})
export class DoctorsPageComponent implements OnInit {
  doctors: Doctor[] = [];
  loading = false;

  searchValue: string = '';
  selectedSpecialty: string = 'All';
  selectedGender: string = 'All';
  specialties: string[] = ['All'];
  genders: string[] = ['All', 'Male', 'Female'];

  get pageArray() {
    // Trả về mảng số nguyên cho pagination
    return Array.from({ length: this.maxPage }, (_, i) => i);
  }

  // Pagination
  page = 1;
  perPage = 4;
  maxPage = 1;
  paginatedDoctors: Doctor[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.fetchDoctors();
  }

  async fetchDoctors() {
    this.loading = true;
    try {
      // Gọi RPC có filter/search
      const doctors: Doctor[] = await this.supabaseService.callRpc(
        'fetch-doctor',
        {
          _name: this.searchValue,
          _specialty: this.selectedSpecialty,
          _gender: this.selectedGender,
        }
      );
      this.doctors = doctors;
      // Lấy danh sách specialty
      const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));
      this.specialties = ['All', ...specialties];

      this.page = 1; // Reset page
      this.updatePagination();
    } catch (e: any) {
      alert('Failed to fetch doctors: ' + e.message);
    }
    this.loading = false;
  }

  async onSearch(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value || '';
    await this.fetchDoctors();
  }
  async selectSpecialty(spec: string) {
    this.selectedSpecialty = spec;
    await this.fetchDoctors();
  }
  async selectGender(g: string) {
    this.selectedGender = g;
    await this.fetchDoctors();
  }
  goToPage(pg: number) {
    if (pg < 1 || pg > this.maxPage) return;
    this.page = pg;
    this.updatePagination();
  }
  updatePagination() {
    this.maxPage = Math.max(1, Math.ceil(this.doctors.length / this.perPage));
    const start = (this.page - 1) * this.perPage;
    this.paginatedDoctors = this.doctors.slice(start, start + this.perPage);
  }
}
