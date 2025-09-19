import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Role} from 'src/app/enum/Role';
import {Router, RouterOutlet} from '@angular/router';
import {routerTransition} from '../../shared';
import {CdkOverlayOrigin, Overlay, OverlayConfig, OverlayContainer} from '@angular/cdk/overlay';
import {JwtResponse} from "../../model/common/JwtResponse";
import {UserService} from "../../shared/services/model/user.service";
import {MatDialog} from "@angular/material/dialog";
import {LoginDialogComponent} from "../login-dialog/login-dialog.component";
import {UserIdleService} from "angular-user-idle";
import {DistUtils} from "../../shared/util/DistUtils";
import {ComponentPortal} from '@angular/cdk/portal';
import {OverlayComponent} from '../overlay/overlay.component';
import {UtilityService} from "../../shared/services/model/utility.service";

interface FilePreviewDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  maxWidth?: string;
  width?: string;
}

const DEFAULT_CONFIG: FilePreviewDialogConfig = {
  panelClass: 'search-panel',
  hasBackdrop: true,
  backdropClass: 'dark-backdrop'
}

@Component({
  selector: 'app-mat-navigation',
  templateUrl: './mat-navigation.component.html',
  styleUrls: ['./mat-navigation.component.css'],
  animations: [routerTransition()]
})
export class MatNavigationComponent implements OnInit {

  currentUserSubscription: Subscription;
  name$;
  name: string;
  currentUser: JwtResponse;
  root = '/';

  @ViewChild(CdkOverlayOrigin) _overlayOrigin: CdkOverlayOrigin;

  themeColor: 'primary' | 'accent' | 'warn' = 'primary'; // 👈 notice this
  isDark = true; // 👈 notice this
  constructor(private userService: UserService,
              private router: Router,
              private overlayContainer: OverlayContainer,
              private _dialog: MatDialog,
              private userIdle: UserIdleService,
              public overlay: Overlay,
              private _u_service: UtilityService) {
  }

  get utils() {
    return DistUtils;
  }

  prepareRoute(o: RouterOutlet) {
    return o.isActivated ? o.activatedRoute : '';
  }

  ngOnInit() {

    this.name$ = this.userService.name$.subscribe(aName => this.name = aName);
    this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (!user || user.role === Role.Administrator) {
        this.root = '/';
      } else {
        // TODO
        this.root = '/';
      }
    });

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser !== null) {
      this.name = this.currentUser.name;
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }

  logout() {
    this.userService.logout();
    this.userIdle.stopWatching();
    this.router.navigate(['/home']);
    localStorage.removeItem("currentUser");
    this.currentUser = null;
  }

  openLoginDialog() {
    this._dialog.open(LoginDialogComponent, {
      panelClass: 'dist-dialog-container'
    });
  }

  adminOrRedactor(user: JwtResponse) {
    return user.role === Role.Administrator || user.role === Role.Redactor;
  }

  openOverlay(config: FilePreviewDialogConfig = {}) {
    const dialogConfig = {...DEFAULT_CONFIG, ...config};
    const overlayRef = this.createOverlay(dialogConfig);
    this._u_service.overlayRef = overlayRef;
    const searchPreviewPortal = new ComponentPortal(OverlayComponent);

    overlayRef.backdropClick().subscribe(() => {
      overlayRef.detach();
    });
    overlayRef.attach(searchPreviewPortal);
  }

  private createOverlay(config: FilePreviewDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: FilePreviewDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      maxWidth: config.maxWidth,
      width: config.width,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
}
