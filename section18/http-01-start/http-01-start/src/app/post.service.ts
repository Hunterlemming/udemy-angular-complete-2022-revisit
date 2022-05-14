import { HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  //#region Observables

  error = new Subject<string>();

  //#endregion

  //#region Variables

  private backendUrl: string = 
    'https://ng-complete-guide-80289-default-rtdb.europe-west1.firebasedatabase.app/posts.json';

  //#endregion

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string): void {
    const postData: Post = {title, content};
    this.http.post<{ name: string }>(
      this.backendUrl, 
      postData,
      {
        observe: 'response'
      }
    ).subscribe(
      response => console.log(response),
      error => this.error.next(error.message)
    )
  }

  fetchPosts(): Observable<Post[]> {
    return this.http.get<{ [key: string]: Post }>(
      this.backendUrl,
      {
        headers: new HttpHeaders({
          'Custom-Header': 'Hello'
        }),
        params: new HttpParams()
          .set('print', 'pretty')
          .set('custom', 'key')
      }
    ).pipe(
      map(responseData => {
        if (responseData === null) return []; 
        return Object.keys(responseData)
          .map(key => {
            responseData[key].id = key;
            return responseData[key];
          });
      }),
      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }

  deletePosts(): Observable<any> {
    return this.http.delete(
      this.backendUrl,
      {
        observe: 'events',
        responseType: 'text'
      }
    ).pipe(
      tap(event => {
        console.log(event)
        if (event.type === HttpEventType.Sent) {
          // ...
        }
        if (event.type === HttpEventType.Response) {
          console.log(event.body);
        }
      })
    );
  }

}
