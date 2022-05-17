import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  //#region Variables

  private readonly backendUrl = 'https://ng-course-recipe-book-f438e-default-rtdb.europe-west1.firebasedatabase.app/';
  private readonly recipeUrl = this.backendUrl + '/recipes.json';

  //#endregion

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put<Recipe[]>(
      this.recipeUrl, 
      recipes
    ).subscribe(
      response => console.log(response)
    );
  }

}
