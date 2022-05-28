import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //#region Vatiables

  private readonly apiKey = 'AIzaSyBFopsPBWyWlKzHaFB-veP9-SZtWMFM5Vg';
  private readonly createEmailPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
  private readonly signInEmailPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

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
    ).pipe(
      catchError(errorRes => {
        let errorMessage = 'An unknown error occured!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(() => new Error(errorMessage));
        }
        switch(errorRes.error.error.message) {
          case "EMAIL_EXISTS":
            errorMessage = 'This email already exists!'
            break;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.signInEmailPasswordUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true        
      }
    )
  }

  //#endregion

}
