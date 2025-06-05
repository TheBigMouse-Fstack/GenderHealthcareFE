// ==================== IMPORTS ====================
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
import { UserService } from '../../Services/user.service';
import { TokenService } from '../../Services/token.service';

// ==================== COMPONENT DECORATOR ====================
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, GoogleComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  // ==================== STATE / PROPERTY ====================
  showPass = false;
  showConfirmPass = false;
  formSubmitted = false;
  isUsed = false;
  errorMsg = '';
  isSubmitting = false;

  // ==================== VIEWCHILD & DEPENDENCY INJECTION ====================
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private tokenService = inject(TokenService);

  // ==================== CONSTRUCTOR ====================
  constructor() {
    afterNextRender(() => {
      // --- Lấy dữ liệu đã lưu, nếu có ---
      const savedForm = window.localStorage.getItem('save-register-form');
      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        Promise.resolve().then(() => {
          if (this.form().controls['phone'] && loadedFormData.phone) {
            this.form().controls['phone'].setValue(loadedFormData.phone);
          }
          if (this.form().controls['fullName'] && loadedFormData.fullName) {
            this.form().controls['fullName'].setValue(loadedFormData.fullName);
          }
        });
      }
      // --- Lưu form mỗi khi thay đổi, debounce tránh spam ---
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
              })
            ),
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }

  // ==================== METHODS ====================

  /**
   * Khi user nhập phone thì reset cờ isUsed và errorMsg
   */
  onPhoneInput() {
    this.isUsed = false;
    this.errorMsg = '';
  }

  /**
   * Xử lý khi submit form đăng ký
   * @param formData Dữ liệu form (NgForm)
   */
  onRegister(formData: NgForm) {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.formSubmitted = true;
    this.errorMsg = '';
    console.log(formData.form.value);
    if (formData.valid) {
      const subscription = this.userService
        .registerUser(formData.form.value)
        .subscribe({
          next: (res: any) => {
            alert('User Registration Success');
            // Nếu có token thì lưu vào session luôn
            if (res.token) {
              this.tokenService.setTokenSession(res.token);
              // TODO: redirect user sang trang chính nếu muốn
            }
            // --- Xoá form lưu tạm & reset form (nếu muốn) ---
            // localStorage.removeItem('save-register-form');
            // formData.resetForm();
          },
          error: (err) => {
            if (err.status === 401) {
              this.errorMsg = 'Số điện thoại này đã được đăng ký!';
              alert(this.errorMsg);
              this.isUsed = true;
            } else if (err.status === 500) {
              this.errorMsg = 'Lỗi server, vui lòng thử lại sau!';
              alert(this.errorMsg);
            } else {
              this.errorMsg = 'Đăng ký thất bại, kiểm tra lại thông tin!';
              alert(this.errorMsg);
            }
            this.isSubmitting = false;
          },
          complete: () => {
            this.isSubmitting = false;
          },
        });
      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    } else {
      this.formSubmitted = true;
      this.isSubmitting = false;
      return;
    }
  }
}
