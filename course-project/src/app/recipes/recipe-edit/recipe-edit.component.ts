import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  //#region References, Properties and Accessors

  recipeForm: FormGroup;
  
  get ingredientControls(): FormControl[] {
    const controls = (<FormArray>this.recipeForm.get('ingredients')).controls;
    return controls as FormControl[];
  }

  //#endregion
  
  //#region Variables

  private id: number;
  private editMode: boolean = false;

  //#endregion

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService) { }

  //#region Public Methods

  onSubmit(): void {
    console.log(this.recipeForm);
  }

  //#endregion

  //#region Private Methods
  
  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      // Adding ingredients
      if (recipe.ingredients) {
        recipe.ingredients.forEach( (ingredient) => {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name),
              'amount': new FormControl(ingredient.amount)
            })
          );
        });
      }

      this.recipeForm = new FormGroup({
        'name': new FormControl(recipeName),
        'imagePath': new FormControl(recipeImagePath),
        'description': new FormControl(recipeDescription),
        'ingredients': recipeIngredients
      });
    }
  }

  //#endregion

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = this.id != null && !Number.isNaN(this.id);
        this.initForm();
      }
    );
  }

}
