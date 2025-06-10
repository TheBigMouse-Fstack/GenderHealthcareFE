// ================== IMPORTS ==================
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {
  type ContactMessage,
  type UserLogin,
  UserRegister,
} from '../models/user.model';

// ================== SERVICE DECORATOR ==================
@Injectable({
  providedIn: 'root',
})
export class UserService {
  // =========== CONSTRUCTOR & DI ===========
  constructor(private http: HttpClient) {}

  // =========== PRIVATE HEADER BUILDER ===========
  /**
   * Tạo headers cho request HTTP
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      authorization: `Bearer ${environment.authorization}`,
      'Content-Type': 'application/json',
    });
  }

  // =========== REGISTER USER ===========
  /**
   * Đăng ký user mới
   * @param userRegisterData Dữ liệu user
   */
  registerUser(userRegisterData: UserRegister) {
    // Chuyển số 0xxx... về +84xxx...
    let phoneForSupabase = userRegisterData.phone.startsWith('0')
      ? '+84' + userRegisterData.phone.substring(1)
      : userRegisterData.phone;
    const body: UserRegister = {
      phone: phoneForSupabase,
      password: userRegisterData.password,
    };
    // Gửi POST tới /register
    return this.http.post(`${environment.apiEndpoint}/register`, body, {
      headers: this.getHeaders(),
    });
  }

  // =========== LOGIN USER ===========
  /**
   * Đăng nhập bằng số điện thoại & password
   * @param phone SĐT user
   * @param password Mật khẩu
   */
  loginWithPhone(phone: string, password: string) {
    // Chuyển số 0xxx... về +84xxx...
    let phoneForSupabase = phone.startsWith('0')
      ? '+84' + phone.substring(1)
      : phone;
    const body: UserLogin = {
      phone: phoneForSupabase,
      password,
    };
    // Gửi POST tới /login
    return this.http.post(`${environment.apiEndpoint}/login`, body, {
      headers: this.getHeaders(),
    });
  }

  // =========== Form ===========
  sendContactMessage(data: ContactMessage) {
    // Đổi endpoint theo BE của bạn
    console.log(data);
    return this.http.post(`${environment.apiEndpoint}/login`, data, {
      headers: this.getHeaders(),
    });
  }
}
