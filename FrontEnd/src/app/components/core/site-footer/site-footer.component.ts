import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router, NavigationEnd, Event as RouterEvent, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [TranslateModule, RouterModule, CommonModule],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss'
})
export class SiteFooterComponent {
  activeRoute: string = '/home';

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.urlAfterRedirects;
      });
  }
}
