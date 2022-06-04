import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  //#region References

  @ViewChild(PlaceholderDirective, {static: false}) 
  alertHost: PlaceholderDirective; 

  //#endregion

  //#region Properties

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = null;

  //#endregion

  constructor(
    private authService: AuthService, 
    private router: Router,
  ) { }

  //#region Public Methods

  onSubmit(form: NgForm): void {
    if (!form.valid) return;
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }

    authObs.subscribe({
      next: resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: (errorMessage: string) => {
        console.log(errorMessage);
        this.errorMessage = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    });
    
    form.reset();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleError(): void {
    this.errorMessage = null;
  }

  //#endregion

  //#region Private Methods

  private showErrorAlert(errorMessage: string): void {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    hostViewContainerRef.createComponent<AlertComponent>(AlertComponent);
  }

  //#endregion

  ngOnInit(): void {
  }

}
