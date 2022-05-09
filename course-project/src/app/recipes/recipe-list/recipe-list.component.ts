import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  //#region References, Properties and Accessors
  
  recipes: Recipe[];
  
  //#endregion

  //#region Variables

  private subs: Subscription[] = [];

  //#endregion

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute) { }
  
  //#region Public Methods

  onNewRecipe(): void {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  //#endregion

  //#region Private Methods

  private subscribeToRecipesChanged(): Subscription {
    return this.recipeService.recipesChanged.subscribe(
      (newRecipes: Recipe[]) => { 
        this.recipes = newRecipes; 
      } 
    );
  }

  //#endregion

  ngOnInit(): void {
    this.subs.push(
      this.subscribeToRecipesChanged()
    );
  }
  
  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

}
