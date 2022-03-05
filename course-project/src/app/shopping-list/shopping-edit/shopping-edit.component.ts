import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') nameInputRef: ElementRef;
  @ViewChild('amountInput') amountInputRef: ElementRef;
  @Output() ingredientAdded = new EventEmitter<Ingredient>();

  constructor() { }

  onAddItem(): void {
    const ingName: string = (<HTMLInputElement>this.nameInputRef.nativeElement).value;
    const ingAmount: number = (<HTMLInputElement>this.nameInputRef.nativeElement).valueAsNumber;
    this.ingredientAdded.emit(new Ingredient(ingName, ingAmount))
  }

  ngOnInit(): void {
  }

}
