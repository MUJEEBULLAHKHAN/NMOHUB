import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { RtlService } from '../../../rtl.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss'
})
export class SiteHeaderComponent {
  _userInfo!: any;
  currentLang: string = 'en-us';
  isScrolled = false;
  isMenuOpen = false;
  activeRoute: string = '/';

  excludedRoutes = ['/customer-project', '/auth/login', '/customer-register', '/customer-project?serv=1', '/customer-project?serv=2'];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private rtlService: RtlService


  ) {
  }

  ngOnInit(): void {
    // this.GetAllService();
    this.translate.addLangs(['en-us', 'ar-ae']);
    this.translate.setDefaultLang('en-us');

    const savedLang = localStorage.getItem('lang') || 'en-us';
    this.translate.use(savedLang);
    this.currentLang = savedLang;
    this.rtlService.setDirection(savedLang);

    const storedUser = localStorage.getItem('userdetails');
    if (storedUser) {
      this._userInfo = JSON.parse(storedUser);
    }

    // detect current active route
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.urlAfterRedirects;

        if (!this.isExcludedRoute(this.activeRoute)) {
          this.rtlService.setDirection(this.currentLang);
        } else {
          this.removeRtlLtr(); // make sure RTL/LTR CSS is not applied
        }
      });
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'en-us' ? 'ar-ae' : 'en-us';
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
    if (!this.isExcludedRoute(this.activeRoute)) {
      this.rtlService.setDirection(this.currentLang);
    }
  }
  private isExcludedRoute(route: string): boolean {
    return this.excludedRoutes.some(r => route.startsWith(r));
  }


  private removeRtlLtr() {
    // remove dir/lang from <html>
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('lang');

    // remove RTL/LTR CSS
    const existingLink = document.getElementById('bootstrap-rtl-css');
    if (existingLink) {
      existingLink.remove();
    }
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10; // adjust scroll trigger
  }

  Logout() {
    localStorage.removeItem('userinfo');
    localStorage.removeItem('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userdetails');

    this._userInfo = undefined;

    //this.router.navigate(['auth/login']);
  }
}
