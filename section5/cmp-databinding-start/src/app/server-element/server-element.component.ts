import { AfterContentInit, AfterViewInit, Component, ContentChild, DoCheck, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ServerElementComponent implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterViewInit {
  @Input('srvElement') element: {type: string, name: string, content: string};
  @Input() name: string;
  @ViewChild('heading', {static: true}) heading: ElementRef;
  @ContentChild('contentParagraph', {static: true}) paragraph: ElementRef;

  constructor() {
    console.log("Constructor called!");
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("NgOnChanges called!");
    console.log(changes);
  }

  ngOnInit(): void {
    console.log("NgOnInit called!");
    console.log("Text Content: " + (<HTMLInputElement>this.heading.nativeElement).textContent);
    console.log("Text Content of paragraph: " + (<HTMLInputElement>this.paragraph.nativeElement).textContent);
  }

  ngDoCheck(): void {
    console.log("DoCheck called!");
  }

  ngAfterContentInit(): void {
    console.log("AfterContentInit called!");
    console.log("Text Content of paragraph: " + (<HTMLInputElement>this.paragraph.nativeElement).textContent);
  }

  ngAfterViewInit(): void {
    console.log("AfterViewInit called!");
    console.log("Text Content: " + (<HTMLInputElement>this.heading.nativeElement).textContent);
  }

}
