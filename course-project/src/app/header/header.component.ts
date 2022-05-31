import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  //#region Properties

  isAuthenticated: boolean = false;

  //#endregion
  
  //#region Variables

  private _subs: Subscription[] = [];

  //#endregion

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) { }

  //#region Public Methods

  onSaveData(): void {
    this.dataStorageService.storeRecipes();
  }

  onFetchData(): void {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(): void {
    this.authService.logout();
  }

  //#endregion

  //#region Private Methods

  private userSubscription(): Subscription {
    return this.authService.user.subscribe({
      next: user => {
        this.isAuthenticated = !!user;
      }
    });
  }

  //#endregion

  ngOnInit(): void {
    this._subs.push(this.userSubscription());
  }

  ngOnDestroy(): void {
    this._subs.forEach(s => s.unsubscribe());
  }

}
