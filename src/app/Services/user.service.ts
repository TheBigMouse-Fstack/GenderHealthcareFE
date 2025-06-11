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
      Authorization: `Bearer ${environment.authorizationv2}`,
      'Content-Type': 'application/json',
    });
  }

  // =========== REGISTER USER ===========
  /**
   * Đăng ký user mới
   * @param userRegisterData Dữ liệu user
   */
  registerUser(userRegisterData: UserRegister) {
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

  // =========== fetchdata ===========
  getUserProfile() {
    // Lấy token từ localStorage, nếu không có thì lấy từ sessionStorage
    let accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      accessToken = sessionStorage.getItem('access_token');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${environment.apiEndpoint}/me`, { headers });
  }
}
