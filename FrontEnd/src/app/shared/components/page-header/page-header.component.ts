import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { every, filter } from 'rxjs';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  routerEvents: any[] = [];


  hideHeader: boolean = false;



  constructor(private router: Router) {

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.routerEvents = event.url.split('/').filter(e => e != '');

        this.hideHeader = this.isSalesDashboardRoute();

      }
    })
  }


  private isSalesDashboardRoute(): boolean {
    // Check if the routerEvents indicate that we are on the sales dashboard route
    return this.routerEvents.length > 0 && this.routerEvents[0] === 'sales-dashboard';
  }





}
