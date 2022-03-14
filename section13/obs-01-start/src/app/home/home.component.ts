import { Component, OnDestroy, OnInit } from '@angular/core';

import { interval, Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private firstObsSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    // this.firstObsSubscription =
    //   interval(1000).subscribe(count => {
    //     console.log(count);
    //   });
    const customIntervalObservable: Observable<number> = new Observable(
      observer => {
        let count = 0;
        setInterval(
          () => {
            observer.next(count);
            if (count === 2) observer.complete();
            if (count > 3) observer.error(new Error('Count is greater than 3!'));
            count++;
          },
          1000
        );
      }
    );

    this.firstObsSubscription =
    customIntervalObservable
      .pipe(
        filter((data: number) => data > 0),
        map((data: number) => `Round: ${data + 1}`)
      )
      .subscribe(
        (next: string) => console.log(next),
        (err: Error) => {
          console.log(err);
          alert(err.message);
        },
        () => console.log('Completed!')
      );

  }

  ngOnDestroy(): void {
    this.firstObsSubscription.unsubscribe();
  }

}
