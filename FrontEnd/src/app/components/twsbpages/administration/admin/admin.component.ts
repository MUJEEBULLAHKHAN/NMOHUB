import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
//import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-admin',
  standalone: false,
  // imports: [ OverlayscrollbarsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  public menuData: any[] = [];
  user: any;

  constructor(private modalService: NgbModal) {

    this.menuData = [
      // { id: 1, menuText: 'Users', icon: 'ri-settings', secure: false, routerUrl: '../user-admin' },
      // { id: 2, menuText: 'Workshops', icon: 'ri-settings', secure: true, routerUrl: '../workshop-admin' },
      
      //  { id: 1, menuText: 'City', icon: 'ri-settings', secure: false, routerUrl: '../city-admin' },
      //  { id: 2, menuText: 'Project Area', icon: 'ri-settings', secure: false, routerUrl: '../project-type-admin' },
      //  { id: 3, menuText: 'Project Stage', icon: 'ri-settings', secure: false, routerUrl: '../project-stage-admin' },
      //  { id: 4, menuText: 'Payment Status', icon: 'ri-settings', secure: false, routerUrl: '../payment-status-admin' },
       { id: 5, menuText: 'Service', icon: 'ri-settings', secure: false, routerUrl: '../service-admin' },
      //  { id: 6, menuText: 'Packages', icon: 'ri-settings', secure: false, routerUrl: '../package-admin' },
      //  { id: 7, menuText: 'Pages', icon: 'ri-settings', secure: false, routerUrl: '../pages-admin' },
       { id: 8, menuText: 'Configuration', icon: 'ri-settings', secure: false, routerUrl: '../configuration-admin' },
       { id: 9, menuText: 'Calender', icon: 'ri-settings', secure: false, routerUrl: '../calender-schedule-admin' },
       { id: 9, menuText: 'Meeting Access Room', icon: 'ri-settings', secure: false, routerUrl: '/meeting-access-room' },
       { id: 9, menuText: 'Closed Office', icon: 'ri-settings', secure: false, routerUrl: '/closed-office-admin' },
       { id: 9, menuText: 'Co Working Space', icon: 'ri-settings', secure: false, routerUrl: '../co-working-space-admin' },
       { id: 9, menuText: 'Expert Available Slots', icon: 'ri-settings', secure: false, routerUrl: '../create-expert-available-slots' },
       { id: 9, menuText: 'My Calendar', icon: 'ri-settings', secure: false, routerUrl: '../my-calendar' },
      //  { id: 9, menuText: 'View All Experts', icon: 'ri-settings', secure: false, routerUrl: '../view-all-experts' },
       { id: 10, menuText: 'News', icon: 'ri-settings', secure: false, routerUrl: '../newsletter-admin' },
       { id: 10, menuText: 'Package', icon: 'ri-settings', secure: false, routerUrl: '../package-admin' },
       { id: 11, menuText: 'Areas Of Expertise', icon: 'ri-settings', secure: false, routerUrl: '../areas-of-expertise-admin' },
       { id: 12, menuText: 'Foreign Service Package', icon: 'ri-settings', secure: false, routerUrl: '../foreign-service-package-admin' },

      //  Project Area

      // { id: 4, menuText: 'Vehicle Colors', icon: 'ri-settings', secure: false, routerUrl: '../color-admin' },
      // { id: 5, menuText: 'Courtesy Cars', icon: 'ri-settings', secure: false, routerUrl: '../courtesy-cars-admin' },
      // { id: 6, menuText: 'SMS Templates', icon: 'ri-settings', secure: false, routerUrl: '../workshop-sms-templates' },
      // { id: 6, menuText: 'Email Templates', icon: 'ri-settings', secure: false, routerUrl: '../workshop-email-templates' },
      // { id: 6, menuText: 'Document Templates', icon: 'ri-settings', secure: false, routerUrl: '../document-templates' },
      // { id: 7, menuText: 'Vendors', icon: 'ri-settings', secure: false, routerUrl: '../vendor-admin' },
      // { id: 8, menuText: 'Rates', icon: 'ri-settings', secure: false, routerUrl: '../workshop-rates-admin' },
      // { id: 9, menuText: 'Document Types', icon: 'ri-settings', secure: false, routerUrl: '../document-types-admin' },
      // { id: 10, menuText: 'Disclaimer', icon: 'ri-settings', secure: false, routerUrl: '../disclaimer-admin' },
      //  { id: 11, menuText: 'Department Type', icon: 'ri-settings', secure: false, routerUrl: '../department-type-admin' },
      // { id: 12, menuText: 'Workshop Survey Question', icon: 'ri-settings', secure: false, routerUrl: '../workshop-survey-question-admin' },
      // { id: 13, menuText: 'CSI Submission', icon: 'ri-settings', secure: false, routerUrl: '../csi-submission-admin' },
      // { id: 15, menuText: 'Task Reference', icon: 'ri-settings', secure: false, routerUrl: '../task-reference-admin' },
      // { id: 16, menuText: 'Communication Method', icon: 'ri-settings', secure: false, routerUrl: '../communication-method-admin' },
      // { id: 17, menuText: 'Quality Control Question', icon: 'ri-settings', secure: false, routerUrl: '../quality-control-question-admin' },
      // { id: 18, menuText: 'Link Sub Departments', icon: 'ri-settings', secure: false, routerUrl: '../sub-activities-admin' },
      // { id: 18, menuText: 'Link CSI Company To OEMs', icon: 'ri-settings', secure: false, routerUrl: '../csi-oem-manufacturer-mapping' },

    ];
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userdetails') as string)

    // if (this.user.jobTitle != 'Administrator' && this.user.jobTitle != 'Super Administrator') {
    //   this.menuData = this.menuData.filter(x => x.secure == false);
    // }

    // if (this.user.jobTitle == 'Administrator' || this.user.jobTitle == 'Super Administrator') {
    //   const roleMenu = { id: 14, menuText: 'Roles', icon: 'ri-settings', secure: false, routerUrl: '../roles-admin' };
    //   this.menuData.push(roleMenu);
    // }
  }

  openWindowCustomClass(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  selectedCars = [3];
  cars = [
    { id: 1, name: 'Jay@gmail.com' },
    { id: 2, name: 'Kimo@gmail.com' },
    { id: 3, name: 'Don@gmail.com' },
    { id: 4, name: 'kimo@gmail.com' },
  ];



  htmlContent1: string = ``;


  ngOnDestroy() {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }

  allMailremove() {

  }

}
