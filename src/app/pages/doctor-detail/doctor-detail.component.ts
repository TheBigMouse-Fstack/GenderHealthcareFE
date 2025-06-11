import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-doctor-detail',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './doctor-detail.component.html',
  styleUrl: './doctor-detail.component.css',
})
export class DoctorDetailComponent {}
