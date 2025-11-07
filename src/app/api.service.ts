import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, UpdateStatusResponse } from './models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://n8n.keotecnologia.com/webhook/account-statements';
  private updateStatusUrl = 'https://n8n.keotecnologia.com/webhook/4753d96a-9634-4c90-8071-2fe7f3a349e4/update-status';

  constructor(private http: HttpClient) { }

  getAccountStatements(request: { mesEmision: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, request);
  }

  updatePaymentStatus(statementId: number): Observable<UpdateStatusResponse> {
    return this.http.put<UpdateStatusResponse>(`${this.updateStatusUrl}/${statementId}`, {});
  }
}
