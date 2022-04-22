import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  //#region Properties and References

  @ViewChild('f', {static: false}) slForm: NgForm;

  editMode: boolean = false;

  //#endregion

  //#region Variables

  private subs: Subscription[] = [];
  
  private editedItemIndex: number;
  private editedItem: Ingredient;

  //#endregion

  constructor(private slService: ShoppingListService) { }
  
  //#region Public Methods

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.onClear();
  }

  onDelete(): void {
    if (!this.editMode) return;
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
  
  onClear(): void {
    this.slForm.reset();
    this.editMode = false;
  }

  //#endregion

  //#region Private Methods

  private subscribeToStartedEditing(): Subscription {
    return this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    );
  }

  //#endregion

  ngOnInit(): void {
    this.subs.push(
      this.subscribeToStartedEditing()
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
