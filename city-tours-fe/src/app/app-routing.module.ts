import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './pages/home/home/home.component';
import {NewsCreateEditComponent} from './pages/news/news-create-edit/news-create-edit.component';
import {NewsManageComponent} from './pages/news/news-manage/news-manage.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {DistrictHomeComponent} from "./pages/district-home/district-home.component";
import {DistrictOpComponent} from "./pages/district-home/district-op/district-op.component";
import {PoiHomeComponent} from "./pages/poi-home/poi-home.component";
import {PoiOpComponent} from "./pages/poi-home/poi-op/poi-op.component";
import {UserManageComponent} from './pages/user/user-manage/user-manage.component';
import {UserOpComponent} from './pages/user/user-op/user-op.component';
import {NewsDetailComponent} from './pages/news/news-detail/news-detail.component';
import {NewsListComponent} from './pages/news/news-list/news-list.component';
import {HomeDetailComponent} from "./pages/home/home-detail/home-detail.component";
import {PoiDetailComponent} from "./pages/poi-home/poi-detail/poi-detail.component";
import {ActiveGuard} from './_guards/active.guard';
import {ResetPswComponent} from './pages/reset-psw/reset-psw.component';
import {AuthGuard} from './_guards/auth.guard';
import {ProfileComponent} from './pages/profile/profile/profile.component';
import {ProjectComponent} from "./pages/project/project.component";
import {SearchComponent} from "./pages/search/search.component";
import {DistrictDetailComponent} from "./pages/district-home/district-detail/district-detail.component";
import {RoleGuard} from './_guards/role.guard';
import {RedactorEditComponent} from './pages/profile/redactor-edit/redactor-edit.component';
import {DeployComponent} from "./pages/deploy/deploy.component";


const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'home-detail/:id', component: HomeDetailComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'news-management', component: NewsManageComponent, canActivate: [ActiveGuard]},
  {path: 'news-create', component: NewsCreateEditComponent, canActivate: [ActiveGuard]},
  {path: 'news-edit/:id', component: NewsCreateEditComponent, canActivate: [ActiveGuard]},
  {path: 'district-home', component: DistrictHomeComponent, canActivate: [ActiveGuard]},
  {path: 'news-detail/:id', component: NewsDetailComponent},
  {path: 'district-op/:id', component: DistrictOpComponent, canActivate: [ActiveGuard]},
  {path: 'news-list', component: NewsListComponent},
  {path: 'poi-home', component: PoiHomeComponent, canActivate: [ActiveGuard]},
  {path: 'poi-op/:id', component: PoiOpComponent, canActivate: [ActiveGuard]},
  {path: 'user-management', component: UserManageComponent, canActivate: [RoleGuard]},
  {path: 'user-op/:id', component: UserOpComponent, canActivate: [RoleGuard]},
  {path: 'redactor-edit', component: RedactorEditComponent, canActivate: [ActiveGuard]},
  {path: 'poi-detail/:id', component: PoiDetailComponent},
  {path: 'district-detail/:id', component: DistrictDetailComponent},
  {path: 'reset-psw', component: ResetPswComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'project', component: ProjectComponent},
  {path: 'deploy', component: DeployComponent, canActivate: [AuthGuard]},
  {path: 'search', component: SearchComponent, canActivate: [ActiveGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
