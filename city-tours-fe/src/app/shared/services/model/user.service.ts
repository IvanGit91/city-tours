import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import {ConfigService} from '../../config.service';
import {JwtResponse} from "../../../model/common/JwtResponse";
import {User} from "../../../model/User";
import {Psw} from 'src/app/pages/reset-psw/reset-psw.component';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<User> {

  public currentUser: Observable<JwtResponse>;
  public nameTerms = new Subject<string>();
  public name$ = this.nameTerms.asObservable();
  private currentUserSubject: BehaviorSubject<JwtResponse>;

  constructor(http: HttpClient, private cookieService: CookieService, configSrv: ConfigService) {
    super(configSrv, http, 'user');
    const memo = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<JwtResponse>(JSON.parse(memo));
    this.currentUser = this.currentUserSubject.asObservable();
    cookieService.set('currentUser', memo);
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(loginForm): Observable<JwtResponse> {
    const url = this.apiUrl + `/login`;
    return this.http.post<JwtResponse>(url, loginForm.value).pipe(
      tap(user => {
        if (user && user.token) {
          this.cookieService.set('currentUser', JSON.stringify(user));
          if (loginForm.remembered) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          //console.log("LOGIN: ", user);
          this.nameTerms.next(user.name);
          this.currentUserSubject.next(user);
          return user;
        }
        return null;
      }),
      catchError(this.handleError('Login Failed', null))
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.cookieService.delete('currentUser');
  }

  signUp(user: User): Observable<User> {
    const url = this.apiUrl + this.authUrl + `/register`;
    return this.http.post<User>(url, user);
  }

  update(user: User): Observable<User> {
    const url = this.apiUrl + `/profile`;
    return this.http.put<User>(url, user);
  }

  getAll(): Observable<User[]> {
    const url = this.apiUrl + this.authUrl + `/allProfile`;
    return this.http.get<User[]>(url);
  }

  updateOne(user: User): Observable<User> {
    const url = this.apiUrl + this.authUrl + `/updateUser`;
    return this.http.put<User>(url, user);
  }

  getOne(id: string): Observable<User> {
    const url = this.apiUrl + this.authUrl + `/oneProfile/${id}`;
    return this.http.get<User>(url);
  }

  activate(id: number, tempPsw: string, newPsw: string): Observable<User> {
    const url = this.apiUrl + this.authUrl + `/activateProfile/${id}`;
    let bodyPassword = new Psw(tempPsw, newPsw);
    return this.http.post<User>(url, bodyPassword);
  }

  reset(email: string): Observable<User> {
    const url = this.apiUrl + this.authUrl + `/resetProfile/${email}`;
    return this.http.post<User>(url, {});
  }

  check(email: string): Observable<boolean> {
    const url = this.apiUrl + this.authUrl + `/checkEmail/${email}`;
    return this.http.get<boolean>(url);
  }

  checkPsw(psw: string): Observable<boolean> {
    const url = this.apiUrl + this.authUrl + `/checkPsw`;
    return this.http.get<boolean>(url, {
      params: {
        psw: psw
      }
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
