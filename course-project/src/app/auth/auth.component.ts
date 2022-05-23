import { Component, OnInit } from '@angular/core';

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

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  //#endregion

  ngOnInit(): void {
  }

}
