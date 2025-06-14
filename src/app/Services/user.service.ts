// ================== IMPORTS ==================
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import {
  type ContactMessage,
  type UserLogin,
  type UserRegister,
} from '../models/user.model';
import { Doctor, DoctorDetail } from '../models/doctor.model';
import { Observable } from 'rxjs';

// ================== SERVICE DECORATOR ==================
@Injectable({
  providedIn: 'root',
})
export class UserService {
  // =========== CONSTRUCTOR ===========

  constructor(private http: HttpClient) {}

  // =========== PRIVATE HEADER BUILDER ===========
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // =========== REGISTER USER ===========
  registerUser(userRegisterData: UserRegister) {
    const phone = userRegisterData.phone.startsWith('0')
      ? '+84' + userRegisterData.phone.slice(1)
      : userRegisterData.phone;

    const body: UserRegister = {
      phone,
      password: userRegisterData.password,
    };

    return this.http.post(`${environment.apiEndpoint}/register`, body, {
      headers: this.getHeaders(),
    });
  }

  // =========== LOGIN ===========
  loginWithPhone(phone: string, password: string) {
    const formattedPhone = phone.startsWith('0')
      ? '+84' + phone.slice(1)
      : phone;

    const body: UserLogin = {
      phone: formattedPhone,
      password,
    };

    return this.http.post(`${environment.apiEndpoint}/login`, body, {
      headers: this.getHeaders(),
    });
  }

  // =========== PROFILE ===========
  getUserProfile() {
    let token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${environment.apiEndpoint}/me`, { headers });
  }

  // =========== FETCH DOCTORS ===========
  /**
   * Gọi API lấy danh sách bác sĩ, có filter
   */
  getDoctors(name: string, specialty: string, gender: string) {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (specialty && specialty !== 'All')
      params = params.set('specialty', specialty);
    if (gender && gender !== 'All') params = params.set('gender', gender);

    return this.http.get<Doctor[]>(`${environment.apiEndpoint}/fetch-doctor`, {
      params,
    });
  }
  getDoctorById(id: string): Observable<DoctorDetail> {
    const params = new HttpParams().set('doctor_id', id);
    return this.http.get<DoctorDetail>(
      `${environment.apiEndpoint}/fetch-doctor-id`,
      { params }
    );
  }
}
