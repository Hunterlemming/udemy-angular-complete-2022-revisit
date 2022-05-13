import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  //#region Properties
  
  loadedPosts: Post[] = [];
  isFetching: boolean = false;
  error = null;

  //#endregion

  //#region Variables

  private subscriptions: Subscription[] = [];

  //#endregion

  constructor(private postService: PostService) {}

  //#region Public Methods

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts()
      .subscribe(
        response => {
          this.loadedPosts = [];
        }
      );
  }

  onHandleError() {
    this.error = null;
  }

  //#endregion

  //#region Private Methods

  private subscribeToPostServiceError(): Subscription {
    return this.postService.error
      .subscribe(
        errorMessage => this.error = errorMessage
      );
  }

  private fetchPosts(): void {
    this.isFetching = true;
    this.postService.fetchPosts()
      .subscribe(
        posts => {
          this.isFetching = false;
          this.loadedPosts = posts;
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.error = error.message;
          this.isFetching = false;
        });
  }

  //#endregion

  ngOnInit() {
    this.subscriptions.push(
      this.subscribeToPostServiceError()
    );
    this.fetchPosts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
