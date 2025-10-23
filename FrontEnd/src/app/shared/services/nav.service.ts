import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

// Menu
export interface Menu {
  headTitle?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  title1?: string;
  icon?: string;
  type?: string;
  badgeValue?: string;
  badgeClass?: string;
  badgeText?: string;
  bgshadow?: string;
  active?: boolean;
  selected?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  children2?: Menu[];
  Menusub?: boolean;
  target?: boolean;
  menutype?: string;
  dirchange?: boolean;
  nochild?: any;
  items?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnInit, OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Add public role properties
  public roleId: any | null = null;
  public roleName: string | null = null;

  // Search Box
  public search = false;

  // Language
  public language = false;

  // Mega Menu
  public megaMenu = false;
  public levelMenu = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen = false;
  active: any;

  constructor(private router: Router) {
    // Initialize role info from localStorage
    this.updateRoleInfo();

    this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  // Method to update role information
  updateRoleInfo() {
    try {
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      this.roleId = roles.length > 0 ? roles[0].id : null;
      this.roleName = roles.length > 0 ? roles[0].name : null;
    } catch (e) {
      this.roleId = null;
      this.roleName = null;
      console.error('Error parsing roles from localStorage', e);
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next;
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    // Dashboard
    { headTitle: 'Main' },
    {
      title: 'Dashboards',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" width="32" height="32" viewBox="0 0 256 256"><path d="M216,115.54V208a8,8,0,0,1-8,8H160a8,8,0,0,1-8-8V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.54a8,8,0,0,1,2.62-5.92l80-75.54a8,8,0,0,1,10.77,0l80,75.54A8,8,0,0,1,216,115.54Z" opacity="0.2"></path><path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path></svg>`,
      type: 'sub',
      selected: false,
      active: false,
      dirchange: false,
      children: [
    { path: '/main-dashboard', title: 'Dashboard', type: 'link', dirchange: false },
    { path: '/dashboard-overview', title: 'Incubator Dashboard', type: 'link', dirchange: false },
    { path: '/mvp-dashboard', title: 'MVP Dashboard', type: 'link', dirchange: false },
    { path: '/feas-dashboard', title: 'Feasibility Study Dashboard', type: 'link', dirchange: false },
    { path: '/preac-dashboard', title: 'Pre Accelator Dashboard', type: 'link', dirchange: false },
    { path: '/foreign-entrepreneur-dashboard', title: 'Foreign Entrepreneur Dashboard', type: 'link', dirchange: false },
        
      ],
    },

    { path: '/job-search/0', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Service Request', type: 'link' },
    { path: '/view-service-requests', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'VO Service Requests', type: 'link' },
    // { path: '/expert-list', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Experts', type: 'link' },
    { path: '/meeting-access-requests', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Meeting Access Requests', type: 'link' },
    { path: '/closed-office-request', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Closed Office Request', type: 'link' },
    { path: '/co-working-space-requests', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Co Working Space Request', type: 'link' },
    { path: '/customize-request', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Customize Package Request', type: 'link' },
    { path: '/admin', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Admin', type: 'link' },
    { path: '/view-all-experts', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'All Experts', type: 'link' },
    { path: '/expert-availability-list', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Experts Availability List', type: 'link' },
    { path: '/booking-list', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="side-menu__icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="32 80 128 136 224 80 128 24 32 80" opacity="0.2"/><polyline points="32 176 128 232 224 176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="32 128 128 184 224 128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polygon points="32 80 128 136 224 80 128 24 32 80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`, title: 'Booking List', type: 'link' },
  ];

  items = new BehaviorSubject<Menu[]>(this.getFilteredMenuItems());

  
getFilteredMenuItems(): Menu[] {
    if (this.roleId === "10") return this.MENUITEMS; // Admin – all
    if (this.roleId === "9") {
      const allowed = [  '/booking-list',
        '/expert-availability-list'];
      return this.MENUITEMS
        .map(item => {
          if (item.children) {
            const filteredChildren = item.children.filter(child => allowed.includes(child.path as string));
            if (filteredChildren.length > 0) {
              return { ...item, children: filteredChildren };
            }
            return null;
          }
          return allowed.includes(item.path as string) ? item : null;
        })
        .filter(Boolean) as Menu[];
    }
    if (this.roleId === "1") {
      const allowed = [
        '/main-dashboard',
        '/dashboard-overview',
        '/mvp-dashboard',
        '/feas-dashboard',
        '/preac-dashboard',
        '/foreign-entrepreneur-dashboard',
        '/view-service-requests',
        '/meeting-access-requests',
        '/closed-office-request',
        '/co-working-space-requests',
        '/customize-request'
      ];
      return this.MENUITEMS
        .map(item => {
          if (item.children) {
            const filteredChildren = item.children.filter(child => allowed.includes(child.path as string));
            if (filteredChildren.length > 0) {
              return { ...item, children: filteredChildren };
            }
            return null;
          }
          return allowed.includes(item.path as string) ? item : null;
        })
        .filter(Boolean) as Menu[];
    }
    //  if (this.roleId === "9") {
    //   const allowed = [
    //     '/main-dashboard','/expert-availability-list','/booking-list'
    //   ];
    //   return this.MENUITEMS
    //     .map(item => {
    //       if (item.children) {
    //         const filteredChildren = item.children.filter(child => allowed.includes(child.path as string));
    //         if (filteredChildren.length > 0) {
    //           return { ...item, children: filteredChildren };
    //         }
    //         return null;
    //       }
    //       return allowed.includes(item.path as string) ? item : null;
    //     })
    //     .filter(Boolean) as Menu[];
    // }
    return [];
  }
  

  // Update menu items based on current role
  updateMenuItems() {
    this.updateRoleInfo();
    this.items.next(this.getFilteredMenuItems());
  }

  ngOnInit(): void {
    // Initialize with filtered menu items
    this.updateMenuItems();
  }
}