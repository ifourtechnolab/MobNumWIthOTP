import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class RegisterService {

  constructor(private http: HttpClient) { }

  getOtp(mobileNumber: string, resend: boolean, type: number): Observable<any> {
    return this.http.get<any>(`${environment.endPoint}User/GetOtp?mobileNumber=${mobileNumber}&type=${type}&resend=${resend}`);
  }

  verifyOtp(mobileNumber: string, otp: string, type: number): Observable<any> {
    return this.http.post<any>(`${environment.endPoint}User/VerifyOtp?mobileNumber=${mobileNumber}&type=${type}&otp=${otp}`, '');
  }
}
