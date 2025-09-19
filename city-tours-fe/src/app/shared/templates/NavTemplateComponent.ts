import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-nav-template',
  template: `
    <ng-template #navTemplate let-currentUser>
      <button mat-button color="primary" routerLink="/home" (click)="sidenav.close()">Home</button>
      <button mat-button color="primary" routerLink="/user-management"
              *ngIf="currentUser && currentUser.role === 'ROLE_ADMINISTRATOR'"
              (click)="sidenav.close()">{{ 'MODELS.USERS' | translate }}
      </button>

      <button mat-button color="primary" [matMenuTriggerFor]="loggeduser">{{ 'LABELS.NEWS' | translate }}</button>
      <mat-menu #loggeduser="matMenu">
        <button class="nav-item nav-link" mat-menu-item routerLink="/news-management" *ngIf="currentUser"
                (click)="sidenav.close()">
          <fa-icon [icon]="['fas','book']"></fa-icon>
          {{ 'LABELS.MANAGE_NEWS'  | translate }}
        </button>
        <button class="nav-item nav-link" mat-menu-item routerLink="/news-list" (click)="sidenav.close()">
          <fa-icon [icon]="['fas','book']"></fa-icon>
          {{ 'LABELS.ALL_NEWS'  | translate }}
        </button>
      </mat-menu>

      <ng-container *ngIf="currentUser">
        <button mat-button color="primary" [matMenuTriggerFor]="district">{{ 'MODELS.DISTRICT' | translate }}</button>
        <mat-menu #district="matMenu">
          <button class="nav-item nav-link" mat-menu-item routerLink="/district-home" (click)="sidenav.close()">
            <mat-icon>location_city</mat-icon>
            {{ 'MODELS.DISTRICT' | translate }}
          </button>
          <button class="nav-item nav-link" mat-menu-item routerLink="/poi-home" (click)="sidenav.close()">
            <mat-icon> place</mat-icon>
            {{ 'MODELS.POI' | translate }}
          </button>
        </mat-menu>
      </ng-container>
      <button mat-button color="primary" routerLink="/project"
              (click)="sidenav.close()">{{ 'LABELS.PROJECT' | translate }}
      </button>
      <button mat-button color="primary" routerLink="/deploy"
              *ngIf="currentUser && currentUser.account === 'system@admin.com'" (click)="sidenav.close()">Deploy
      </button>
    </ng-template>
  `
})

export class NavTemplateComponent implements OnInit {
  @Input()
  sidenav: any;

  ngOnInit(): void {
  }
}
