import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  //#region Properties and References

  ingredients: Ingredient[];

  //#endregion

  //#region Variables

  private subscription: Subscription;

  //#endregion

  constructor(private slService: ShoppingListService) { }

  //#region Public Methods

  onEditItem(id: number): void {
    this.slService.startedEditing.next(id);
  }

  //#endregion

  ngOnInit(): void {
    this.ingredients = this.slService.getIngredients();
    this.subscription =
      this.slService.ingredientsChanged
        .subscribe(
          (values: Ingredient[]) => this.ingredients = values
        );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
