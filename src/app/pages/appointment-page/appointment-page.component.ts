import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactMessage } from '../../models/user.model';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SupabaseService } from '../../Services/supabase.service';

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

  private supabaseService = inject(SupabaseService);

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

  async onContactSubmit(form: NgForm) {
    this.formSubmitted = true;
    this.errorMsg = '';
    if (form.invalid || this.isSubmitting) {
      this.markAllAsTouched(form);
      return;
    }
    this.isSubmitting = true;

    const contactData = { ...form.value };

    // Nếu muốn gọi lên Supabase function:
    try {
      await this.supabaseService.callRpc('send_contact_message', {
        full_name: contactData.fullName,
        email: contactData.email,
        phone: contactData.phone,
        message: contactData.message,
      });
      alert('Gửi thành công lên Supabase!');
      // Xử lý localStorage như cũ...
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
    } catch (err: any) {
      this.errorMsg = 'Lỗi gửi lên Supabase! ' + (err.message || '');
      alert(this.errorMsg);
      this.isSubmitting = false;
    }
  }
}
