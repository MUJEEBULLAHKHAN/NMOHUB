import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component'
import { HeaderComponent } from './components/header/header.component';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { TabToTopComponent } from './components/tab-to-top/tab-to-top.component';
import { LoaderComponent } from './components/loader/loader.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppShowCodeDirective } from './directives/appshowcode.directive';
import { FullscreenDirective } from './directives/fullscreen.directive';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';
import { AuthenticationLayoutComponent } from './layouts/authentication-layout/authentication-layout.component';
import { PageheaderLayoutComponent } from './layouts/pageheader-layout/pageheader-layout.component';
import { RouterModule } from '@angular/router';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';   
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { NgbModule,NgbActiveOffcanvas,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SvgReplaceDirective } from './directives/svgReplace.directive';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DisplaymessageComponent } from './components/displaymessage/displaymessage.component';
import { TwsbpagesmoduleModule } from '../components/twsbpages/twsbpagesmodule.module';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ContentLayoutComponent,
    SwitcherComponent,
    PageHeaderComponent,
    TabToTopComponent,
    LoaderComponent,
    FooterComponent,
    FullscreenDirective,
    HoverEffectSidebarDirective,
    AppShowCodeDirective,  
    PageheaderLayoutComponent,
    DashboardHeaderComponent,
    SvgReplaceDirective,
    //DisplaymessageComponent

], 

  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ColorPickerModule,
    OverlayscrollbarsModule,
    ReactiveFormsModule,
    FormsModule,
    AuthenticationLayoutComponent
    //FlatpickrModule
],
  exports:[
    HeaderComponent,
    SidebarComponent,  
    ContentLayoutComponent,
    SwitcherComponent,  
    PageHeaderComponent, 
    TabToTopComponent,
    LoaderComponent,
    FooterComponent,
    FullscreenDirective,
    AppShowCodeDirective,
    HoverEffectSidebarDirective,
    AppShowCodeDirective,
    DashboardHeaderComponent,
   // DisplaymessageComponent
  
],
providers:[
  ColorPickerService,
  NgbActiveOffcanvas,
  NgbModal,
  HttpClient
],
})
export class SharedModule { }
 