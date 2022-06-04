import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  //#region References

  @Input() message: string;
  @Output() close = new EventEmitter<void>(); 

  //#endregion

  //#region Public Methods

  onClose(): void {
    this.close.emit();
  }

  //#endregion

  constructor() { }

  ngOnInit(): void {
  }

}
