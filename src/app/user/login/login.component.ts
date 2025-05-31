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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, GoogleComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  enteredEmailOrPhone = '';
  enteredPassword = '';
  RememberMe = false;
  ShowPass = false;
  formSubmitted = false;
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('save-login-form');

      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedEmailOrPhone = loadedFormData.emailOrPhone;
        Promise.resolve().then(() => {
          const control = this.form().controls['emailOrPhone'];
          if (control) {
            control.setValue(savedEmailOrPhone);
          }
        });
      }

      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'save-login-form',
              JSON.stringify({ emailOrPhone: value.emailOrPhone })
            ),
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  onSubmit(formData: NgForm) {
    this.formSubmitted = true;
    if (!formData.valid) return; // Không submit nếu chưa hợp lệ
    // Thực hiện đăng nhập ở đây, ví dụ gọi API
    // ...
    formData.reset();
  }
}
