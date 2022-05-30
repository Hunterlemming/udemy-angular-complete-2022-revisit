import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, Observable, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
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

  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put<Recipe[]>(
      this.recipeUrl, 
      recipes
    ).subscribe(
      response => console.log(response)
    );
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<Recipe[]>(
          this.recipeUrl,
          {
            params: new HttpParams()
              .set('auth', user.token)
          }
        );
      }),
      map(recipes =>{
        return recipes.map(recipe => {
          return {
            ...recipe, 
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes)
      })
    );
  }

}
