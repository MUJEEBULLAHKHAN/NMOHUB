// import { Component, Renderer2 } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { SiteHeaderComponent } from '../../../components/core/site-header/site-header.component';
// import { SiteFooterComponent } from '../../../components/core/site-footer/site-footer.component';

// @Component({
//   selector: 'app-authentication-layout',
//   templateUrl: './authentication-layout.component.html',
//   styleUrl: './authentication-layout.component.scss', 
//   standalone:true,
//   imports: [ CommonModule, RouterModule, SiteHeaderComponent,SiteFooterComponent]
// })
// export class AuthenticationLayoutComponent {

// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SiteHeaderComponent } from '../../../components/core/site-header/site-header.component';
import { SiteFooterComponent } from '../../../components/core/site-footer/site-footer.component';

@Component({
  selector: 'app-authentication-layout',
  templateUrl: './authentication-layout.component.html',
  styleUrl: './authentication-layout.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, SiteHeaderComponent, SiteFooterComponent]
})
export class AuthenticationLayoutComponent {
  showHeaderFooter = true;

  private hiddenRoutes = [
    '/customer-register',
    '/customer-project',
    '/customer-project1',
    '/auth/login',
    '/customer-project?serv=1', '/customer-project?serv=2',
    '/feasibility-study-project?serv=3',
    '/preac-study-project?serv=4',
    '/foreigner-entrepreneur-project',
    '/foreigner-entrepreneur-project?serv=9',
    '/customer-project-confirmation',
    '/experts',
    '/expert-list',
    
  
  ];

   constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.url;
        
        // Check if current URL matches any hidden route
        this.showHeaderFooter = !this.hiddenRoutes.some(route => {
          // For routes with query parameters, use exact match
          if (route.includes('?')) {
            return url.includes(route);
          }
          // For routes without query parameters, check if URL starts with the route
          return url.startsWith(route);
        });
      });
  }
}
