import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorDetail } from '../../models/doctor.model';
import { UserService } from '../../Services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-doctor-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NgClass],
  templateUrl: './doctor-detail.component.html',
})
export class DoctorDetailComponent implements OnInit {
  doctor = signal<DoctorDetail | null>(null);

  loading = signal(true);
  errorMsg = signal('');
  activeTab = 'about';

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  fallbackImage = 'https://via.placeholder.com/300x400?text=No+Image';

  ngOnInit(): void {
    const doctor_id = this.route.snapshot.paramMap.get('id');
    if (doctor_id) {
      this.fetchDoctor(doctor_id);
    } else {
      this.errorMsg.set('Không tìm thấy bác sĩ');
      this.loading.set(false);
    }
  }

  fetchDoctor(doctor_id: string): void {
    this.loading.set(true);
    this.errorMsg.set('');

    this.userService.getDoctorById(doctor_id).subscribe({
      next: (res) => {
        this.doctor.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Không thể tải dữ liệu bác sĩ');
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  get doctorName(): string {
    return this.doctor()?.staff_members?.full_name || 'Dr. [unknown]';
  }

  getImageUrl(link: string | null | undefined): string {
    if (!link) return this.fallbackImage;
    return link.includes('//doctor')
      ? link.replace('//doctor', '/doctor')
      : link;
  }
  get staffLanguages(): string[] {
    return this.doctor()?.staff_members?.languages ?? [];
  }

  get educationDegrees() {
    return this.doctor()?.educations?.degrees ?? [];
  }

  get certificationList() {
    return this.doctor()?.certifications?.certifications ?? [];
  }
}
