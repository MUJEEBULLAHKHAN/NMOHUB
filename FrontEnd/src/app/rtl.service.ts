import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RtlService {
  private renderer: Renderer2;
  private rtlLinkId = 'bootstrap-rtl-css';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setDirection(lang: string) {
    const html = document.documentElement;

    if (lang === 'ar-ae') {
      this.renderer.setAttribute(html, 'dir', 'rtl');
      this.renderer.setAttribute(html, 'lang', 'ar');
      this.loadRtlCss();
    } else {
      this.renderer.setAttribute(html, 'dir', 'ltr');
      this.renderer.setAttribute(html, 'lang', 'en');
      this.loadLtrCss();
    }
  }

  private loadRtlCss() {
    this.removeExistingCss();
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'id', this.rtlLinkId);
    // this.renderer.setAttribute(link, 'href', 'node_modules/bootstrap/dist/css/bootstrap.rtl.min.css');
    document.head.appendChild(link);
  }

  private loadLtrCss() {
    this.removeExistingCss();
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'id', this.rtlLinkId);
    // this.renderer.setAttribute(link, 'href', 'node_modules/bootstrap/dist/css/bootstrap.min.css');
    document.head.appendChild(link);
  }

  private removeExistingCss() {
    const existingLink = document.getElementById(this.rtlLinkId);
    if (existingLink) {
      existingLink.remove();
    }
  }
}
