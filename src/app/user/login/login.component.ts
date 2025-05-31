import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GoogleComponent } from '../google/google.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, GoogleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  enteredEmail = '';
  enterdPassword = '';
  RememberMe = false;
  ShowPass = false;

  onSubmit(form: NgForm) {
    console.log('Email:', this.enteredEmail);
    console.log('Password:', this.enterdPassword);
    // Hoặc dùng object:
    // console.log({ email: this.email, password: this.password });
  }
}
