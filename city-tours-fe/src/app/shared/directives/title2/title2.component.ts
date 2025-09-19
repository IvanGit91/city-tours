import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-title2',
  templateUrl: './title2.component.html',
  styleUrls: ['./title2.component.css']
})
export class Title2Component implements OnInit {

  @Input() t_icon: string;
  @Input() t_title: any;
  @Input() t_go_back: boolean;
  @Input() t_array: boolean = false;
  @Input() t_no_margin: boolean = false;


  constructor(private location: Location) {
  }

  ngOnInit(): void {
  }

  back(): void {
    this.location.back()
  }
}
