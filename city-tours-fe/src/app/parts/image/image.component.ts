import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  @Input() src: string;
  @Input() lazy: boolean;

  image = null;

  constructor() {
    if (this.lazy === undefined) {
      this.lazy = true;
    }
  }

  ngOnInit(): void {
    // JS Preload
    if (!this.lazy) {
      this.image = new Image();
      this.image.src = this.src;
    }
  }

}
