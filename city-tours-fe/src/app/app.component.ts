import {Component} from '@angular/core';
import {DistUtils} from "./shared/util/DistUtils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'city-tours';

  constructor(private d_utils: DistUtils) {
  }
}
