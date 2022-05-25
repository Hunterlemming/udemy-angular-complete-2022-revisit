import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //#region Vatiables

  private readonly apiKey = 'AIzaSyBFopsPBWyWlKzHaFB-veP9-SZtWMFM5Vg';
  private readonly createEmailPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;

  //#endregion

  constructor(private http: HttpClient) { }

  //#region Public Methods

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      this.createEmailPasswordUrl,
      { 
        email: email, 
        password: password,
        returnSecureToken: true
      } 
    );
  }

  //#endregion

}
