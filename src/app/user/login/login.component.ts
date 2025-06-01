import { Router } from '@angular/router';

import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GoogleComponent } from '../google/google.component';
import { debounceTime } from 'rxjs';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, GoogleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  enteredPhone = '';
  enteredPassword = '';
  RememberMe = false;
  ShowPass = false;
  formSubmitted = false;
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  private loginService = inject(LoginService);
  private router = inject(Router);
  //

  constructor() {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('save-login-form');

      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedPhone = loadedFormData.Phone;
        Promise.resolve().then(() => {
          const control = this.form().controls['phone'];
          if (control) {
            control.setValue(savedPhone);
          }
        });
      }
      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'save-login-form',
              JSON.stringify({ phone: value.phone })
            ),
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }
  //

  async onSubmit(formData: NgForm) {
    this.formSubmitted = true;
    if (formData.valid) {
      this.loginService
        .loginWithPhone(this.enteredPhone, this.enteredPassword)
        .subscribe({
          next: (res: any) => {
            // Lưu token nếu thành công
            localStorage.setItem('token', res.data.access_token);
            // Chuyển hướng
            this.router.navigate(['/']);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      formData.reset();
    }
  }
}
