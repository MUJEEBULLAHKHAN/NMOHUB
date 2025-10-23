import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dashboardRoutingModule } from '../../components/dashboards/dashboard.routes';
import { salesRoutingModule } from '../../components/dashboards/sales/salesdashboard.routes';
import { TwsbpagesmoduleModule } from '../../components/twsbpages/twsbpagesmodule.module';
import { JwtInterceptor } from '../../interceptors/jwt.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';



 export const content: Routes = [
   { path: '', children: [
   ...dashboardRoutingModule.routes,
   ...salesRoutingModule.routes,
   ...TwsbpagesmoduleModule.routes
   
  ]},
 
];

@NgModule({
    imports: [RouterModule.forRoot(content, {
      scrollPositionRestoration: 'top'
    })],
    exports: [RouterModule],
    providers: []
})
export class SaredRoutingModule { }
