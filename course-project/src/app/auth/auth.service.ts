import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { LocalStorageKeys } from '../shared/local-storage-keys';
import { User, UserData } from './user.model';

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

  //#region Static Variables

  private static readonly API_KEY = 'AIzaSyBFopsPBWyWlKzHaFB-veP9-SZtWMFM5Vg';
  private static readonly CREATE_EMAIL_PASSWORD_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${AuthService.API_KEY}`;
  private static readonly SIGNIN_EMAIL_PASSWORD_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${AuthService.API_KEY}`;

  //#endregion

  //#region Class Variables

  private _tokenExpirationTimer: any;   //NodeJS.Timeout

  //#endregion

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  //#region Public Methods

  signUp(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      AuthService.CREATE_EMAIL_PASSWORD_URL,
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
      AuthService.SIGNIN_EMAIL_PASSWORD_URL,
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

  autoLogin(): void {
    const loadedUser: User = User.toUser(
      JSON.parse(localStorage.getItem(LocalStorageKeys.userData)) as UserData
    );
    if (!loadedUser) {
      return;
    }
    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.autoLogout(loadedUser.remainingTime);
    }
  }

  logout(rerouteDestination: string = '/auth'): void {
    this.user.next(null);
    this.router.navigate([rerouteDestination]);
    localStorage.removeItem(LocalStorageKeys.userData);
    if (this._tokenExpirationTimer) {
      clearTimeout(this._tokenExpirationTimer);
    }
    this._tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    this._tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
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
    this.autoLogout(+authData.expiresIn * 1000);
    localStorage.setItem(LocalStorageKeys.userData, JSON.stringify(user));
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
