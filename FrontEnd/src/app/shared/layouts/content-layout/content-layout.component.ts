import {
  Component,
  ElementRef,
  Renderer2,
  TemplateRef,
  inject,
} from '@angular/core';
import { Menu, NavService } from '../../services/nav.service';
import { SwitcherService } from '../../../shared/services/switcher.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss',
})
export class ContentLayoutComponent {
  private offcanvasService = inject(NgbOffcanvas);
  lastSegment: any;
  public menuItems!: Menu[];
  constructor(
    private router:Router,
    private elementRef: ElementRef,
    public navServices: NavService,
    public SwitcherService: SwitcherService,
    public renderer: Renderer2
  ) {
    this.navServices.items.subscribe((menuItems: any) => {
      this.menuItems = menuItems;
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      window.scrollTo(0, 0);
    });
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (window.innerWidth <= 992) {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') == 'close' ? 'close' : 'close');
    }
  }
  
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  clickOnBody() {
    document.querySelector('#headersearch')?.classList.remove('searchdrop')
    document.querySelector('#cartitemclose')?.classList.remove('show');
    document.querySelector('#header-cart-items-scroll')?.removeAttribute('class');
    document.querySelector('#notificationitemclose')?.classList.remove('show')||document.querySelector('#notificationitemclose')?.classList.remove('show');
    const htmlElement = this.elementRef.nativeElement.ownerDocument.documentElement;
      this.renderer.removeAttribute(htmlElement, 'data-icon-overlay');

      const navStyle = document.documentElement.getAttribute('data-nav-style');
      
    if (document.documentElement.getAttribute('data-toggled')  == 'icon-text-close') {
      this.renderer.removeAttribute(htmlElement, 'data-icon-text');
    }
    if (document.documentElement.getAttribute('data-nav-layout') == 'horizontal'
            && window.innerWidth > 992) {
            this.closeMenu();
    } else
    if (navStyle === 'menu-click' || navStyle === 'menu-hover' || navStyle === 'icon-click' || navStyle === 'icon-hover') {
      document.querySelector('.double-menu-active')?.setAttribute('style', 'display: none;');
    }   

    if(document.documentElement.getAttribute('data-vertical-style')  == 'doublemenu'){
      document.querySelector('.slide-menu')?.classList.add('double-menu-active');
      document.querySelector('.slide-menu')?.setAttribute('style', 'display: block;');
   }
  
    const switcher = this.elementRef.nativeElement.querySelector('.switcher');
    if (switcher) {
      this.renderer.removeClass(switcher, 'show');
      document.querySelector('#responsive-overlay')?.classList.add('active');
    } else {
      document.querySelector('#responsive-overlay')?.classList.remove('active');
    }
    const sidebar = this.elementRef.nativeElement.querySelector('.sidebar');
    if (sidebar) {
      this.renderer.removeClass(sidebar, 'show');
    }

    document.querySelector('#responsive-overlay')?.classList.remove('active');
    if (window.innerWidth <= 992) {
      htmlElement?.setAttribute(
        'data-toggled',
        htmlElement?.getAttribute('data-toggled') == 'close' ? 'close' : 'close'
      );
    }
  }

  closeMenu() {
    this.menuItems?.forEach((a: any) => {
      if (this.menuItems) {
        a.active = false;
      }
      a?.children?.forEach((b: any) => {
        if (a.children) {
          b.active = false;
        } 
      });
    });
  }

  clearToggle() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    document.querySelector('#responsive-overlay')?.classList.remove('active');
  }
  
}
