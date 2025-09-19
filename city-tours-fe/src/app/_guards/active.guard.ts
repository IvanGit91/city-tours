import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from "../shared/services/model/user.service";

@Injectable({
  providedIn: 'root'
})
export class ActiveGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.userService.currentUserValue;
    if (currentUser) {
      if (currentUser.verify) {
        return true;
      } else {
        this.router.navigate(['reset-psw']);
        return false;
      }
    }
    return false;
  }

}
