import { ForeignEntrepreneurDashboardComponent } from './dashboards/foreign-entrepreneur-dashboard/foreign-entrepreneur-dashboard.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './administration/admin/admin.component';
import { CityAdminComponent } from './administration/city-admin/city-admin.component';
import { CalenderScheduleAdminComponent } from './administration/calender-schedule-admin/calender-schedule-admin.component';
import { ConfigurationAdminComponent } from './administration/configuration/configuration-admin.component';
import { ProjectTypeAdminComponent } from './administration/project-type-admin/project-type-admin.component';
import { ProjectStageAdminComponent } from './administration/project-stage-admin/project-stage-admin.component';
import { PaymentStatusAdminComponent } from './administration/payment-status-admin/payment-status-admin.component';
import { ServiceAdminComponent } from './administration/service-admin/service-admin.component';
import { PackageAdminComponent } from './administration/package-admin/package-admin.component';
import { ServiceRequestComponent } from './service-request/service-request.component';
import { ServiceStatusRequestComponent } from './service-status-request/service-status-request.component';

import { PagesAdminComponent } from './administration/pages-admin/pages-admin.component';
import { ServiceOverviewComponent } from './service/service-overview/service-overview.component';
import { FeasibilityServiceOverviewComponent } from './service/feasibility-service-overview/feasibility-service-overview.component';
import { PreacServiceOverviewComponent } from './service/preac-service-overview/preac-service-overview.component';
import { ForeignerEntrepreneurOverviewComponent } from './service/foreigner-entrepreneur-overview/foreigner-entrepreneur-overview.component';
import { ServiceMainComponent } from './service/service-main/service-main.component';
import { ServiceDocumentsComponent } from './service/service-documents/service-documents.component';
import { ServiceTimelineComponent } from './service/service-timeline/service-timeline.component';
import { ServiceNotesComponent } from './service/service-notes/service-notes.component';
import { ServiceMeetingComponent } from './service/service-meeting/service-meeting.component';
import { ServicePaymentComponent } from './service/service-payment/service-payment.component';
import { MVPDashboardComponent } from './dashboards/mvp-dashboard/mvp-dashboard.component';
import { FeasDashboardComponent } from './dashboards/feas-dashboard/feas-dashboard.component';
import { PreacDashboardComponent } from './dashboards/preac-dashboard/preac-dashboard.component';
import { MVPServiceStatusRequestComponent } from './mvp-service-status-request/mvp-service-status-request.component';
import { PREACServiceStatusRequestComponent } from './preac-service-status-request/preac-service-status-request.component';
import { FeasServiceStatusRequestComponent } from './feas-service-status-request/feas-service-status-request.component';
import { MVPServiceOverviewComponent } from './service/mvp-service-overview/mvp-service-overview.component';
import { MainDashboardComponent } from './dashboards/main-dashboard/main-dashboard.component';







import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { SharedModule } from '../../shared/shared.module';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ColorAdminComponent } from './administration/color-admin/color-admin.component';
import { CourtesyCarsAdminComponent } from './administration/courtesy-cars-admin/courtesy-cars-admin.component';
import { DocumentTypesAdminComponent } from './administration/document-types-admin/document-types-admin.component';
import { RolesAdminComponent } from './administration/roles-admin/roles-admin.component';
import { QualityControlQuestionAdminComponent } from './administration/quality-control-question-admin/quality-control-question-admin.component';
import { CommunicationMethodAdminComponent } from './administration/communication-method-admin/communication-method-admin.component';
import { TaskReferenceAdminComponent } from './administration/task-reference-admin/task-reference-admin.component';

import { SubActivitiesAdminComponent } from './administration/sub-activities-admin/sub-activitiess-admin.component';
import { UserAdminComponent } from './administration/user-admin/user-admin.component';
import { VendorAdminComponent } from './administration/vendor-admin/vendor-admin.component';
import { WorkshopAdminComponent } from './administration/workshop-admin/workshop-admin.component';
import { WorkshopRatesAdminComponent } from './administration/workshop-rates-admin/workshop-rates-admin.component';

import { WorkshopEmailTemplatesAdminComponent } from './administration/workshop-email-templates-admin/workshop-email-templates-admin.component';
import { DocumentTemplatesAdminComponent } from './administration/document-templates-admin/document-templates-admin.component';
import { WorkshopLoginSelectionComponent } from './workshop-login-selection/workshop-login-selection.component';
import { NgbAccordionModule, NgbDropdownModule, NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MatStepperModule } from '@angular/material/stepper';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { CalenderScheduleComponent } from './calender-schedule/calender-schedule.component';
import { ProfileComponent } from './profile/profile.component';
import { DisclaimerAdminComponent } from './administration/disclaimer-admin/disclaimer-admin.component';
import { DepartmentTypeAdminComponent } from './administration/department-type-admin/department-type-admin.component';
import { WorkshopSurveyQuestionAdminComponent } from './administration/workshop-survey-question-admin/workshop-survey-question-admin.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CSISubmissionFieldsAdminComponent } from './administration/csi-submission-fields-admin/csi-submission-fields-admin.component';
import { GalleryConfig, GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { SortablejsModule } from '@maksim_m/ngx-sortablejs';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DropzoneComponent, DropzoneDirective,
  DropzoneConfigInterface,
  DropzoneModule,
  DROPZONE_CONFIG
} from 'ngx-dropzone-wrapper';
import { DashboardOverviewComponent } from './dashboards/dashboard-overview/dashboard-overview.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { VOServicesComponent } from './voservices/voservices.component';
import { VirtualOfficeComponent } from '././administration/virtual-office-request/virtual-office-request.component';

import { NewsletterAdminComponent } from './administration/newsletter-admin/newsletter-admin.component';
import { MeetingAccessRoomAdminComponent } from './meeting-access-room-admin/meeting-access-room-admin.component';
import { ClosedOfficeAdminComponent } from './administration/closed-office-admin/closed-office-admin.component';
import { AreasOfExpertiseAdminComponent } from './administration/areas-of-expertise-admin/areas-of-expertise-admin.component';
import { ForeignServicePackageAdminComponent } from './administration/foreign-service-package-admin/foreign-service-package-admin.component';

import { CoWorkingSpaceAdminComponent } from './administration/co-working-space-admin/co-working-space-admin.component';
import { CoWorkingSpaceRequestsPageComponent } from './administration/co-working-space-requests-page/co-working-space-requests-page.component';
import { MeetingAccessRequestsPageComponent } from './administration/meeting-access-requests-page/meeting-access-requests-page.component';
import { CustomizeRequestPageComponent } from './administration/customize-request/customize-request.component';
import { ClosedOfficeRequestPageComponentComponent } from './administration/closed-office-request-page-component/closed-office-request-page-component.component';
import { ExpertListComponent } from '../../authentication/expert/expert-list.component';
import { ExpertViewComponent } from '../../authentication/expert/expert-view.component';
import { ExpertEditComponent } from '../../authentication/expert/expert-edit.component';
import { ExpertAvailableSlotsComponent } from './administration/expert-available-slots/expert-available-slots.component';
import { ViewAllExpertsComponent } from '../../authentication/expert/view-all-experts/view-all-experts.component';
import { ExpertDayWiseAvailableSlotsComponent } from './administration/expert-day-wise-available-slots/expert-day-wise-available-slots.component';
import { ExpertAvailabilityListComponent } from './administration/expert-availability-list/expert-availability-list.component';
import { BookingListComponent } from './administration/booking-list/booking-list.component';
import { BookingCreateComponent } from './administration/booking-list/booking-create/booking-create.component';
import { CalendarComponent } from './administration/calendar/calendar.component';
import { ExpertCalenderComponent } from './administration/expert-calender/expert-calender.component';
import { ForeignEntrepreneurServiceStatusRequestComponent } from './foreign-entrepreneur-service-status-request/foreign-entrepreneur-service-status-request.component';
import { ExpertFeaturesComponent } from '../../authentication/expert-features/expert-features.component';



export const config: GalleryConfig = {
  // ...
}

export const admin: Routes = [
  { path: 'foreign-entrepreneur-dashboard', component: ForeignEntrepreneurDashboardComponent },


  { path: 'admin', component: AdminComponent },
  { path: 'color-admin', component: ColorAdminComponent },
  { path: 'user-admin', component: UserAdminComponent },
  { path: 'courtesy-cars-admin', component: CourtesyCarsAdminComponent },
  { path: 'document-types-admin', component: DocumentTypesAdminComponent },
  { path: 'roles-admin', component: RolesAdminComponent },
  { path: 'quality-control-question-admin', component: QualityControlQuestionAdminComponent },
  { path: 'communication-method-admin', component: CommunicationMethodAdminComponent },
  { path: 'task-reference-admin', component: TaskReferenceAdminComponent },

  { path: 'city-admin', component: CityAdminComponent },
  { path: 'calender-schedule-admin', component: CalenderScheduleAdminComponent },
  { path: 'configuration-admin', component: ConfigurationAdminComponent },
  { path: 'project-type-admin', component: ProjectTypeAdminComponent },
  { path: 'project-stage-admin', component: ProjectStageAdminComponent },
  { path: 'payment-status-admin', component: PaymentStatusAdminComponent },
  { path: 'service-admin', component: ServiceAdminComponent },
  { path: 'package-admin', component: PackageAdminComponent },
  { path: 'newsletter-admin', component: NewsletterAdminComponent },
  { path: 'job-search/:id', component: ServiceRequestComponent },
  { path: 'meeting-access-room', component: MeetingAccessRoomAdminComponent },
  { path: 'co-working-space-admin', component: CoWorkingSpaceAdminComponent },
  { path: 'co-working-space-requests', component: CoWorkingSpaceRequestsPageComponent },
  { path: 'customize-request', component: CustomizeRequestPageComponent },
  { path: 'meeting-access-requests', component: MeetingAccessRequestsPageComponent },
  { path: 'closed-office-request', component: ClosedOfficeRequestPageComponentComponent },
  { path: 'closed-office-admin', component: ClosedOfficeAdminComponent },
  { path: 'areas-of-expertise-admin', component: AreasOfExpertiseAdminComponent },
  { path: 'foreign-service-package-admin', component: ForeignServicePackageAdminComponent },
  { path: 'view-service-requests', component: VOServicesComponent },
  { path: 'virtual-Office-request', component: VirtualOfficeComponent },
  { path: 'service-status-request/:id', component: ServiceStatusRequestComponent },
  { path: 'pages-admin', component: PagesAdminComponent },
  { path: 'service-overview/:id?', component: ServiceOverviewComponent },
  { path: 'feasibility-service-overview/:id?', component: FeasibilityServiceOverviewComponent },
  { path: 'preac-service-overview/:id?', component: PreacServiceOverviewComponent },
  { path: 'foreigner-entrepreneur-overview/:id?', component: ForeignerEntrepreneurOverviewComponent },
  { path: 'service-main', component: ServiceMainComponent },
  { path: 'service-documents', component: ServiceDocumentsComponent },
  { path: 'service-timeline', component: ServiceTimelineComponent },
  { path: 'service-notes', component: ServiceNotesComponent },
  { path: 'service-meeting', component: ServiceMeetingComponent },
  { path: 'service-payment', component: ServicePaymentComponent },
  { path: 'create-expert-available-slots', component: ExpertAvailableSlotsComponent },






  { path: 'sub-activities-admin', component: SubActivitiesAdminComponent },
  { path: 'vendor-admin', component: VendorAdminComponent },
  { path: 'workshop-admin', component: WorkshopAdminComponent },
  { path: 'workshop-rates-admin', component: WorkshopRatesAdminComponent },

  { path: 'workshop-email-templates', component: WorkshopEmailTemplatesAdminComponent },
  { path: 'document-templates', component: DocumentTemplatesAdminComponent },
  { path: 'workshop-login-selection', component: WorkshopLoginSelectionComponent },
  { path: 'displaymessage', component: DisplaymessageComponent },
  { path: 'calender-schedule', component: CalenderScheduleComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'disclaimer-admin', component: DisclaimerAdminComponent },
  { path: 'department-type-admin', component: DepartmentTypeAdminComponent },
  { path: 'workshop-survey-question-admin', component: WorkshopSurveyQuestionAdminComponent },
  { path: 'csi-submission-admin', component: CSISubmissionFieldsAdminComponent },
  { path: 'dashboard-overview', component: DashboardOverviewComponent },
  { path: 'mvp-dashboard', component: MVPDashboardComponent },
  { path: 'feas-dashboard', component: FeasDashboardComponent },
  { path: 'preac-dashboard', component: PreacDashboardComponent },
  { path: 'mvp-service-status-request/:id', component: MVPServiceStatusRequestComponent },
  { path: 'preac-service-status-request/:id', component: PREACServiceStatusRequestComponent },
  { path: 'mvp-service-overview/:id?', component: MVPServiceOverviewComponent },
  { path: 'feas-service-status-request/:id', component: FeasServiceStatusRequestComponent },
  { path: 'main-dashboard', component: MainDashboardComponent },
  { path: 'expert-list', component: ExpertListComponent },

  { path: 'view-all-experts', component: ViewAllExpertsComponent },
  { path: 'available-day-wise-slots', component: ExpertDayWiseAvailableSlotsComponent },
  { path: 'expert-availability-list', component: ExpertAvailabilityListComponent },
  { path: 'booking-list', component: BookingListComponent },
  { path: 'booking-create', component: BookingCreateComponent },
  { path: 'my-calendar', component: ExpertCalenderComponent },


  // { path: 'expert/:id/view', component: ExpertViewComponent },
  // { path: 'expert/:id/edit', component: ExpertEditComponent }
  { path: 'foreign-entrepreneur-service-status-request/:id', component: ForeignEntrepreneurServiceStatusRequestComponent },


];

@NgModule({
  declarations: [
    AdminComponent,
    ColorAdminComponent,
    CourtesyCarsAdminComponent,
    DocumentTypesAdminComponent,
    RolesAdminComponent,
    QualityControlQuestionAdminComponent,
    CommunicationMethodAdminComponent,
    TaskReferenceAdminComponent,

    CalenderScheduleAdminComponent,
    CityAdminComponent,
    ConfigurationAdminComponent,
    ProjectTypeAdminComponent,
    ProjectStageAdminComponent,
    PaymentStatusAdminComponent,
    PackageAdminComponent,
    ServiceRequestComponent, 
    ServiceStatusRequestComponent,
    PagesAdminComponent,
    ServiceOverviewComponent,
    MVPServiceOverviewComponent,
    MainDashboardComponent,
    FeasibilityServiceOverviewComponent,
  PreacServiceOverviewComponent,
  ForeignerEntrepreneurOverviewComponent,
  ForeignEntrepreneurDashboardComponent,
  ForeignEntrepreneurServiceStatusRequestComponent,
    ServiceMainComponent,
    ServiceDocumentsComponent,
    ServiceTimelineComponent,
    ServiceNotesComponent,
    ServiceMeetingComponent,
    ServicePaymentComponent,


    SubActivitiesAdminComponent,
    UserAdminComponent,
    VendorAdminComponent,
    WorkshopAdminComponent,
    WorkshopRatesAdminComponent,
    ServiceAdminComponent,
    
    WorkshopEmailTemplatesAdminComponent,
    DocumentTemplatesAdminComponent,
    WorkshopLoginSelectionComponent,
    CalenderScheduleComponent,
    //  CalenderScheduleComponent1,
    ProfileComponent,
    DisclaimerAdminComponent,
    DepartmentTypeAdminComponent,
    WorkshopSurveyQuestionAdminComponent,
    CSISubmissionFieldsAdminComponent,
    DashboardOverviewComponent,
    MVPDashboardComponent,
    FeasDashboardComponent,
    PreacDashboardComponent,
    MVPServiceStatusRequestComponent,
    PREACServiceStatusRequestComponent,
    FeasServiceStatusRequestComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgbNavModule,
    MatStepperModule,
    NgSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    NgbAccordionModule,
    NgbDropdownModule,
    GalleryModule,
    LightboxModule,
    NgbModule,
    SortablejsModule,
    FlatpickrModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    FormsModule,
    DropzoneModule,
    OverlayscrollbarsModule,
    DragDropModule,
    NgApexchartsModule,
    MatAutocompleteModule,
    HttpClientModule, AngularEditorModule,
    BookingCreateComponent        
  ],
  exports: [
    ServiceNotesComponent, ServiceMainComponent, ServiceDocumentsComponent, ServiceTimelineComponent,
    ServiceOverviewComponent, MVPServiceOverviewComponent, FeasibilityServiceOverviewComponent, PreacServiceOverviewComponent,
    ForeignEntrepreneurServiceStatusRequestComponent
  ]
  //providers : [FlatpickrDefaults]
})
export class TwsbpagesmoduleModule {
  static routes = admin;
}
