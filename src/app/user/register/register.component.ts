import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleComponent } from '../google/google.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, GoogleComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  showPass = false;
  showConfirmPass = false;

  fullName = '';
  sexIdentity = '';
  email = '';
  password = '';
  confirmPassword = '';

  onRegister() {
    // TODO: Validate dữ liệu, gọi API gửi dữ liệu đăng ký lên backend...
    console.log({
      fullName: this.fullName,
      sexIdentity: this.sexIdentity,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
  }
}
