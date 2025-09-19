import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-dist-accordion',
  templateUrl: './dist-accordion.component.html',
  styleUrls: ['./dist-accordion.component.css']
})
export class DistAccordionComponent implements OnInit {
  panelOpenState = false;
  @Input() m_title: string;
  @Input() m_elems: string[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
