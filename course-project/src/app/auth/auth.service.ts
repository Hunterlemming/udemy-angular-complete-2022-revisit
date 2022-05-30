import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { User } from './user.model';

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

  //#region Observables

  user = new BehaviorSubject<User>(null);

  //#endregion

  //#region Vatiables

  private readonly _apiKey = 'AIzaSyBFopsPBWyWlKzHaFB-veP9-SZtWMFM5Vg';
  private readonly _createEmailPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this._apiKey}`;
  private readonly _signInEmailPasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this._apiKey}`;

  //#endregion

  constructor(private http: HttpClient) { }

  //#region Public Methods

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      this._createEmailPasswordUrl,
      { 
        email: email, 
        password: password,
        returnSecureToken: true
      } 
    ).pipe(
      catchError(this.handleError),
      tap(resp => this.handleAuthentication(resp))
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this._signInEmailPasswordUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true        
      }
    ).pipe(
      catchError(this.handleError),
      tap(resp => this.handleAuthentication(resp))
    );
  }

  //#endregion

  //#region Private Methods

  private handleAuthentication(authData: AuthResponseData): void {
    const expirationDate = new Date(
      new Date().getTime() + (+authData.expiresIn * 1000)
    );
    const user = new User(
      authData.email, 
      authData.localId, 
      authData.idToken, 
      expirationDate
    );
    this.user.next(user);
  }
  
  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occured!';
    // console.log(errorRes);
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }
    switch(errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = 'This email already exists!';
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = 'This email does not exist!';
        break;
      case "INVALID_PASSWORD":
        errorMessage = 'Invalid password!';
        break;
    }
    return throwError(() => new Error(errorMessage));
  }

  //#endregion

}
