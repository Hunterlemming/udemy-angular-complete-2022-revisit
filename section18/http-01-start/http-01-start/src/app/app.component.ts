import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //#region Properties
  
  loadedPosts = [];

  //#endregion

  //#region Variables

  private baseUrl: string = 'https://ng-complete-guide-80289-default-rtdb.europe-west1.firebasedatabase.app/'

  //#endregion

constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.http.post(this.baseUrl + 'posts.json', postData)
      .subscribe(response => console.log(response));
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    this.http.get(this.baseUrl + 'posts.json')
      .pipe(
        map(responseData => {
          return Object.keys(responseData)
            .map(key => ({...responseData[key], id: key}))
        })
      ).subscribe(posts => console.log(posts));
  }
}
