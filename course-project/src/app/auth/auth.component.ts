import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  //#region Properties

  isLoginMode: boolean = true;

  //#endregion

  constructor() { }

  //#region Public Methods

  onSubmit(form: NgForm): void {
    console.log(form.value);
    form.reset();
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  //#endregion

  ngOnInit(): void {
  }

}
