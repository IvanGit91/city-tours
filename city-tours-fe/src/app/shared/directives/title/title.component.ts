import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  @Input() t_ic: any;
  @Input() t_icon: any;
  @Input() t_title: string;
  @Input() t_back_color_class: string;
  @Input() t_hide_border = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
