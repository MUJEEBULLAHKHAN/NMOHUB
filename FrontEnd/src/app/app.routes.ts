import { Routes } from '@angular/router';
import { content } from './shared/routes/content.routes';
import { authen } from './shared/routes/auth.routes';
import { AuthenticationLayoutComponent } from './shared/layouts/authentication-layout/authentication-layout.component';
import { ContentLayoutComponent } from './shared/layouts/content-layout/content-layout.component';
//import { TestingComponent } from './components/twsbpages/testing/testing.component';

export const routes: Routes = [
    
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '', redirectTo: 'services', pathMatch: 'full' },
    { path: '', redirectTo: 'customer-register', pathMatch: 'full' },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: '', redirectTo: 'auth/forgot-password', pathMatch: 'full' },
    { path: '', redirectTo: 'auth/reset-account', pathMatch: 'full' },
    { path: '', redirectTo: 'page', pathMatch: 'full' },
    { path: '', redirectTo: 'customer-project-confirmation', pathMatch: 'full' },
    { path: '', redirectTo: 'customer-project-track', pathMatch: 'full' },
    { path: '', redirectTo: 'customer-application-track', pathMatch: 'full' },
    { path: '', component: ContentLayoutComponent, children: content },
    { path: '', component: AuthenticationLayoutComponent, children: authen },
    { path: '**', redirectTo: '/error/error404', pathMatch: 'full' },
    

    
];
   