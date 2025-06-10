import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactMessage } from '../../models/user.model';
import { UserService } from '../../Services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-appointment-page',
  standalone: true,
  imports: [HeaderComponent, FormsModule, FooterComponent],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.css',
})
export class AppointmentPageComponent implements OnInit {
  isSubmitting = false;
  formSubmitted = false;
  errorMsg = '';
  RememberContact = false;

  // Bind cho form
  contactData: Partial<ContactMessage> = {};

  private userService = inject(UserService);

  ngOnInit() {
    const saved = localStorage.getItem('Remember-contact-form');
    if (saved) {
      this.contactData = JSON.parse(saved);
      this.RememberContact = true;
    }
  }

  onFieldInput(form: NgForm) {
    if (this.RememberContact) {
      localStorage.setItem('Remember-contact-form', JSON.stringify(form.value));
    }
  }
  markAllAsTouched(form: NgForm) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  onContactSubmit(form: NgForm) {
    this.formSubmitted = true;
    this.errorMsg = '';
    if (form.invalid || this.isSubmitting) {
      this.markAllAsTouched(form); // Force show error
      return;
    }
    this.isSubmitting = true;

    const contactData: ContactMessage = { ...form.value };

    this.userService.sendContactMessage(contactData).subscribe({
      next: () => {
        alert('Gửi thành công!');
        if (this.RememberContact) {
          localStorage.setItem(
            'Remember-contact-form',
            JSON.stringify(contactData)
          );
        } else {
          localStorage.removeItem('Remember-contact-form');
        }
        form.resetForm();
        this.formSubmitted = false;
        this.isSubmitting = false;
        this.contactData = {};
      },
      error: () => {
        this.errorMsg = 'Lỗi gửi contact! Vui lòng thử lại.';
        alert(this.errorMsg);
        this.isSubmitting = false;
      },
    });
  }
}
