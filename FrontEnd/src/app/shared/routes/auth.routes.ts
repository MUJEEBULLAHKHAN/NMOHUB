import { RouterModule, Routes } from '@angular/router';
import { errorRoutingModule } from '../../components/error/error.routes';
import { NgModule } from '@angular/core';
export const authen: Routes = [
  {
    path: '', children: [
      ...errorRoutingModule.routes
    ]
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      // import('../../authentication/login/login.component').then((m) => m.LoginComponent),
    import('../../authentication/customer/customer-login/customer-login.component').then((m) => m.CustomerLoginComponent),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('../../authentication/register/register.component').then((m) => m.registerComponent),
  },
  // {
  //   path: 'home',
  //   loadComponent: () =>
  //     import('../../authentication/home-customer/home-customer.component').then((m) => m.HomeCustomerComponent),
  // },
   {
    path: 'home',
    loadComponent: () =>
      import('../../authentication/home-customer1/home-customer.component').then((m) => m.HomeCustomerComponent1),
  },
   {
    path: 'about',
    loadComponent: () =>
      import('../../authentication/about/about.component').then((m) => m.AboutComponent),
  },
   {
    path: 'programs',
    loadComponent: () =>
      import('../../authentication/programs/programs.component').then((m) => m.ProgramsComponent),
  },
   {
    path: 'contact',
    loadComponent: () =>
      import('../../authentication/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('../../authentication/faq/faq.component').then((m) => m.FaqComponent),
  },
  {
    path: 'alumni',
    loadComponent: () =>
      import('../../authentication/alumni/alumni.component').then((m) => m.AlumniComponent),
  },
  {
    path: 'news',
    loadComponent: () =>
      import('../../authentication/news/news.component').then((m) => m.NewsComponent),
  },
  {
    path: 'co-working-spaces',
    loadComponent: () =>
      import('../../authentication/co-working-space/co-working-space.component').then((m) => m.CoWorkingSpaceComponent),
  },
  
  {
    path: 'news/:slug',
    loadComponent: () =>
      import('../../authentication/news-detail/news-detail.component').then((m) => m.NewsDetailComponent),
  },
  
  {
    path: 'services',
    loadComponent: () =>
      import('../../authentication/customer/service-customer/service-customer.component').then((m) => m.ServiceComponent),
  },
  {
    path: 'experts',
    loadComponent: () =>
      import('../../authentication/expert/expert.component').then((m) => m.ExpertComponent),
  },
  // {
  //   path: 'expert-features',
  //   loadComponent: () =>
  //     import('../../authentication/expert-list/expert-list.component').then((m) => m.ExpertListComponent),
  // },
  // {
  //   path: 'expert-list',
  //   loadComponent: () =>
  //     import('../../authentication/expert/expert-list.component').then((m) => m.ExpertListComponent),
  // },
  {
    path: 'experts/:id/view',
    loadComponent: () =>
      import('../../authentication/expert/expert-view.component').then((m) => m.ExpertViewComponent),
  },
  {
    path: 'experts/:id/edit',
    loadComponent: () =>
      import('../../authentication/expert/expert-edit.component').then((m) => m.ExpertEditComponent),
  },
  {
    path: 'view-all-experts',
    loadComponent: () =>
      import('../../authentication/expert/view-all-experts/view-all-experts.component').then((m) => m.ViewAllExpertsComponent),
  },

  {
    path: 'customer-project',
    loadComponent: () =>
      import('../../authentication/customer/cutomer-project/customer-project.component').then((m) => m.CustomerProjectComponent),
  },
  {
    path: 'customer-project1',
    loadComponent: () =>
      import('../../authentication/customer/cutomer-project1/customer-project1.component').then((m) => m.CustomerProject1Component),
  },
  {
    path: 'feasibility-study-project',
    loadComponent: () =>
      import('../../authentication/customer/feasibility-study-project/feasibility-study-project.component').then((m) => m.FeasibilityStudyProjectComponent),
  },
  {
    path: 'preac-study-project',
    loadComponent: () =>
      import('../../authentication/customer/preac-study-project/preac-study-project.component').then((m) => m.PreacProjectComponent),
  },
  {
    path: 'foreigner-entrepreneur-project',
    loadComponent: () =>
      import('../../authentication/customer/foreigner-entrepreneur-project/foreigner-entrepreneur-project.component').then((m) => m.ForeignerEntrepreneurProjectComponent),
  },
  {
    path:  'package-info/:id',
    loadComponent: () =>
      import('../../authentication/customer/package-info/package-info.component').then((m) => m.PackageInfoComponent),
  },
  {
    path: 'customer-register',
    loadComponent: () =>
      import('../../authentication/customer/cutomer-register/customer-register.component').then((m) => m.CustomerRegisterComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('../../authentication/customer/customer-login/customer-login.component').then((m) => m.CustomerLoginComponent),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () =>
      import('../../authentication/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'auth/reset-account',
    loadComponent: () =>
      import('../../authentication/reset-account/reset-account.component').then((m) => m.ResetAccountComponent),
  },
  {
    path: 'page',
    loadComponent: () =>
      import('../../authentication/page/page.component').then((m) => m.PageComponent),
  },
  {
    path: 'customer-project-confirmation',
    loadComponent: () =>
      import('../../authentication/customer/customer-project-confirmation/customer-project-confirmation.component').then((m) => m.CustomerProjectConfirmationComponent),
  },
  {
    path: 'customer-project-track',
    loadComponent: () =>
      import('../../authentication/customer/customer-project-track/customer-project-track.component').then((m) => m.CustomerProjectTrackComponent),
  },
  {
    path: 'customer-application-track',
    loadComponent: () =>
      import('../../authentication/customer/customer-application-track/customer-application-track.component').then((m) => m.CustomerApplicationTrackComponent),
  },
  {
    path: 'expert-features',
    loadComponent: () =>
      import('../../authentication/expert-features/expert-features.component').then((m) => m.ExpertFeaturesComponent),
  },
  // {
  //   path: 'virtual-Office-request',
  //   loadComponent: () =>
  //     import('../../components/twsbpages/administration/virtual-office-request/virtual-office-request.component').then((m) => m.VirtualOfficeComponent),
  // },
  
  
]


@NgModule({
  imports: [RouterModule.forRoot(authen, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'top',
  })],
  exports: [RouterModule]
})
export class AuthenticationsRoutingModule { }