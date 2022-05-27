import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  //#region Properties

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = null;

  //#endregion

  constructor(private authService: AuthService) { }

  //#region Public Methods

  onSubmit(form: NgForm): void {
    if (!form.valid) return;
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      // ...
    } else {
      this.authService.signUp(email, password).subscribe({
        next: resData => {
          console.log(resData);
          this.isLoading = false;
        },
        error: error => {
          console.log(error);
          this.errorMessage = 'An error occured!';
          this.isLoading = false;
        }
      });
    }
    
    form.reset();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  //#endregion

  ngOnInit(): void {
  }

}
