import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';
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
  enteredPhone = '';
  password = '';
  confirmPassword = '';
  formSubmitted = false;
  isUsed = false;

  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      // Lấy dữ liệu đã lưu, nếu có
      const savedForm = window.localStorage.getItem('save-register-form');
      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        // Đợi form render xong mới set value cho các trường
        Promise.resolve().then(() => {
          // Set từng trường có trong localStorage nếu có
          if (this.form().controls['phone'] && loadedFormData.phone) {
            this.form().controls['phone'].setValue(loadedFormData.phone);
          }
          if (this.form().controls['fullName'] && loadedFormData.fullName) {
            this.form().controls['fullName'].setValue(loadedFormData.fullName);
          }
          if (
            this.form().controls['sexIdentity'] &&
            loadedFormData.sexIdentity
          ) {
            this.form().controls['sexIdentity'].setValue(
              loadedFormData.sexIdentity
            );
          }
          // ...các trường khác nếu muốn (tùy ý)
        });
      }

      // Lưu lại form mỗi khi thay đổi, debounce tránh spam
      const subscription = this.form()
        .valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) =>
            window.localStorage.setItem(
              'save-register-form',
              JSON.stringify({
                phone: value.phone,
                fullName: value.fullName,
                sexIdentity: value.sexIdentity,
                // ...thêm các trường khác nếu muốn
              })
            ),
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }
  onPhoneInput() {
    this.isUsed = false;
  }
  onRegister(formData: NgForm) {
    this.formSubmitted = true;
    if (
      formData.form.invalid ||
      this.password !== this.confirmPassword ||
      this.sexIdentity == ''
    ) {
      // Không submit nếu invalid
      console.log(formData.form.invalid);
      return;
    }
    this.isUsed = true;
    if (this.isUsed) {
      return;
    }
    // TODO: Validate thêm & gửi API
    console.log({
      fullName: this.fullName,
      sexIdentity: this.sexIdentity,
      phone: this.enteredPhone,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });

    // Xóa dữ liệu đã lưu nếu đăng ký thành công
    window.localStorage.removeItem('save-register-form');
    formData.resetForm();
  }
}
