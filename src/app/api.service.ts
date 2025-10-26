import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://n8n.keotecnologia.com/webhook/account-statements';

  constructor(private http: HttpClient) { }

  getAccountStatements(request: { mesEmision: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, request);
  }
}
