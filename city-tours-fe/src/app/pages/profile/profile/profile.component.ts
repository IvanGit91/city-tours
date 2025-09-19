import {Component, OnInit} from '@angular/core';
import {JwtResponse} from 'src/app/model/common/JwtResponse';
import {UserService} from 'src/app/shared/services/model/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: JwtResponse = new JwtResponse();

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.currentUser = this.userService.currentUserValue;
  }

}
