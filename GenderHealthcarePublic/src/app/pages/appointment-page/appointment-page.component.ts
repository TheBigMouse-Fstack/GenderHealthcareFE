import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingState } from '../../models/booking.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointmentPage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.css'],
})
export class AppointmentPageComponent implements OnInit {
  private router = inject(Router);
  currentStep = 1;
  booking: BookingState = {};
  formSubmitted = false;
  totalStep = 2; // hoặc số bước bạn muốn

  get progressWidth() {
    // Không ngIf nên vẫn luôn có progress bar, tính theo số step
    if (this.totalStep <= 1) return '0%';
    return `${((this.currentStep - 1) / (this.totalStep - 1)) * 100}%`;
  }
  // ...rest code của bạn

  ngOnInit(): void {
    this.loadBookingState();
  }

  private loadBookingState(): void {
    try {
      const saved = localStorage.getItem('bookingState');
      if (saved) {
        const temp: BookingState = JSON.parse(saved);
        this.booking = { ...temp };
        if (this.booking.type) {
          this.currentStep = 2;
        }
      }
    } catch (error) {
      console.error('Error loading booking state:', error);
      this.booking = {};
      this.currentStep = 1;
    }
  }

  // Step 1: chọn loại booking
  chooseBookingType(type: 'docfirst' | 'serfirst'): void {
    this.booking.type = type;
    this.saveBookingState();
    this.currentStep = 2;
  }

  // Step 2: validate & lưu
  continueStep2(form: NgForm): void {
    this.formSubmitted = true;

    if (!this.isFormValid(form)) {
      this.scrollToFirstError();
      return;
    }

    this.saveBookingState();

    alert('Đã lưu xong bước 2:\n' + JSON.stringify(this.booking, null, 2));

    // this.currentStep = 3;
  }

  backStep2(): void {
    this.currentStep = 1;
    this.formSubmitted = false;
  }

  private saveBookingState(): void {
    try {
      localStorage.setItem('bookingState', JSON.stringify(this.booking));
    } catch (error) {
      console.error('Error saving booking state:', error);
    }
  }

  hasBookingData(): boolean {
    // Check nếu có trường nào đã nhập thì return true
    return !!(
      this.booking.type ||
      this.booking.forWho ||
      (this.booking.age && Number(this.booking.age) > 0) ||
      (this.booking.city && this.booking.city.trim() !== '') ||
      (this.booking.phone && this.booking.phone.trim() !== '')
    );
  }
  goHome(event: Event) {
    event.preventDefault();
    // Nếu form đã nhập (có dữ liệu), mới cảnh báo
    if (this.hasBookingData()) {
      const confirmLeave = window.confirm(
        'Bạn có chắc muốn rời khỏi trang đặt lịch? Dữ liệu sẽ bị xóa!'
      );
      if (confirmLeave) {
        this.resetForm();
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
    return true; // Nếu chưa nhập gì thì cho phép đi luôn
    // Dọn form trước khi về trang chủ
  }
  // Validate toàn bộ form
  private isFormValid(form: NgForm) {
    const hasValidAge = this.isAgeValid();
    const hasValidPhone = this.isPhoneValid();
    const hasForWho = !!this.booking.forWho;
    const hasCity = !!this.booking.city;
    const hasGender = !!this.booking.gender;
    return (
      form.valid &&
      hasForWho &&
      hasValidAge &&
      hasCity &&
      hasValidPhone &&
      hasGender
    );
  }

  // Validate tuổi
  isAgeValid(): boolean {
    if (this.booking.age === undefined || this.booking.age === null) {
      return false;
    }
    const age = Number(this.booking.age);
    return !isNaN(age) && age > 0 && age <= 130;
  }

  // Validate phone (VN only: 10 or 11 digits, start with 0)
  isPhoneValid(): boolean {
    if (!this.booking.phone) return false;
    const cleaned = this.booking.phone.replace(/\D/g, '');
    return /^0\d{9,10}$/.test(cleaned);
  }

  private scrollToFirstError(): void {
    setTimeout(() => {
      const errorElement = document.querySelector('.border-red-400');
      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
  }

  resetForm(): void {
    this.booking = {};
    this.currentStep = 1;
    this.formSubmitted = false;
    localStorage.removeItem('bookingState');
  }
}
