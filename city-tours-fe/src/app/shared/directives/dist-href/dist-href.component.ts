import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dist-href',
  templateUrl: './dist-href.component.html',
  styleUrls: ['./dist-href.component.css']
})
export class DistHrefComponent implements OnInit {

  @Input() t_href: string;

  constructor() {
  }

  ngOnInit(): void {
  }

  redirect() {
    let red = this.t_href;
    if (!red.includes("http")) {
      red = "https://" + red;
    }
    window.open(red, "_blank");
  }

}
