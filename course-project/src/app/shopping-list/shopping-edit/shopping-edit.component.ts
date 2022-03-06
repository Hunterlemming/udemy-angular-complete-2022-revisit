import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') nameInputRef: ElementRef;
  @ViewChild('amountInput') amountInputRef: ElementRef;

  constructor(private slService: ShoppingListService) { }

  onAddItem(): void {
    const ingName: string = (<HTMLInputElement>this.nameInputRef.nativeElement).value;
    const ingAmount: number = (<HTMLInputElement>this.amountInputRef.nativeElement).valueAsNumber;
    this.slService.addIngredient(new Ingredient(ingName, ingAmount));
  }

  ngOnInit(): void {
  }

}
