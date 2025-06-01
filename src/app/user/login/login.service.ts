import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  loginWithPhone(phone: string, password: string) {
    let phoneForSupabase = phone;
    if (phone.startsWith('0')) {
      phoneForSupabase = '+84' + phone.substring(1);
    }

    const body = {
      phone: phoneForSupabase,
      password: password,
    };
    const endpoint = `${environment.mockEndpoint}/login`;
    // Trả về Observable
    return this.http.post(endpoint, body);
  }
}
