import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
    private router: Router,
    private recipeService: RecipeService) { }

  //#region Public Methods

  onSubmit(): void {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.router.navigate(['..'], {relativeTo: this.route});
    } else {
      this.id = this.recipeService.addRecipe(this.recipeForm.value);
      this.router.navigate(['..', this.id], {relativeTo: this.route});
    }
  }

  onAddIngredient(): void {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['..'], {relativeTo: this.route});
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
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        });
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
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
