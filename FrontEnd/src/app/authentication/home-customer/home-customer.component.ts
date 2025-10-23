import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../shared/models/authentication';
import { UserAuthService } from '../../shared/services/twsbservices/user-auth.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../shared/services/twsbservices/service.service';
import { Service } from '../../models/Reference';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './home-customer.component.html',
  styleUrl: './home-customer.component.scss'
})
export class HomeCustomerComponent implements OnInit, OnDestroy {
  authentication = new authentication();
  disabled = '';
  active: any;
  showLoader: boolean | undefined;
  public loginForm!: FormGroup;
  public error: any = '';
  showPassword = false;
  toggleClass = "ri-eye-off-line";
  serviceList!: Service[];

  public _userDetails: any
  role!: string;
  roleId!: number;
  _userInfo!: any;
  constructor(
    public authservice: UserAuthService,
    private elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastr: DisplaymessageComponent,
    public service: ServiceApi,
  ) {

    if (localStorage.getItem('userdetails') != null || localStorage.getItem('userdetails') != undefined) {
      var roles = JSON.parse(localStorage.getItem('roles') ?? '');
      this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
      console.log("USER INFO IS ", this._userInfo);
      this.role = roles[0].name;
      this.roleId = roles[0].id;
    }
  }


  ngOnInit(): void {
    this.GetAllService();
  }

  forgotPassword() {
    this.router.navigate(['auth/forgot-password']);
    //[routerLink]="['auth/forgot-password']"
  }

  ngOnDestroy(): void {
    const bodyElement = this.renderer.selectRootElement('body', true);
    this.renderer.removeAttribute(bodyElement, 'class');
  }

  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }

  scrollToDiv(targetDiv: any) {
    const element = document.getElementById(targetDiv);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  login() {

    localStorage.removeItem('token');
    // localStorage.setItem('token', JSON.stringify(user.body['token']));

    let layoutStyles: any = 'overlay';
    //  this.appStateService.updateState({layoutStyles, menuStyles: '',navigationStyles:'' });
    document.querySelector('.sidemenu-toggle')?.classList.remove('d-none');
    document.querySelector('.header-search-bar')?.setAttribute('style', 'display: block;');
    document.querySelector('.country-selector')?.setAttribute('style', 'display: block;');
    document.querySelector('.header-theme-mode')?.setAttribute('style', 'display: block;');
    document.querySelector('.cart-dropdown')?.setAttribute('style', 'display: block;');
    document.getElementById('messageDropdown')?.setAttribute('style', 'display: block;');
    document.getElementById('mainHeaderProfile')?.setAttribute('style', 'display: block;');
    document.getElementById('mainHeaderProfile')?.setAttribute('style', 'display: block;');
    document.querySelector('.single-page-header')?.classList.add('d-none');
    document.getElementById('btnSignOutFromWorkshopSelection')?.setAttribute('style', 'display:none;');

    // const html = document.documentElement;
    // html.setAttribute('data-vertical-style', 'overlay');

    // localStorage.setItem('workshop', JSON.stringify(Item));
    // this.workshopNameSubject.setWorkshopName(Item.workshopName, Item.workshopId);
    this.router.navigate(['dashboard-overview']);

    //  if (this.validateForm(this.authentication.emailAddress, this.authentication.password)) {
    //   this.showLoader = true;
    //   this.authservice.Login(this.authentication).subscribe({
    //     next: (user) => 
    //     {
    //       if(user.body.success)
    //       {
    //         this._userDetails = JSON.stringify(user.body);
    //         localStorage.setItem('userinfo', this._userDetails);
    //         localStorage.setItem('roles', JSON.stringify(user.body['roles']));
    //         localStorage.setItem('token', JSON.stringify(user.body['token']));
    //         localStorage.setItem('userdetails', JSON.stringify(user.body['userDetails']));
    //         localStorage.setItem('workshop', JSON.stringify(user.body['workshop']));

    //         this.router.navigate(['workshop-login-selection']);
    //       }
    //       else
    //       {
    //         this.toastr.displayErrorMessage('NMO',user.body.message);
    //         this.showLoader = false;
    //       }
    //     },     
    //     error: (error) =>
    //     {
    //       this.toastr.displayErrorMessage('NMO',error);
    //       this.showLoader = false;
    //     },
    //     complete: () => {
    //       this.showLoader = false;
    //     } 
    //   });
    //  }
    //  else
    //  {
    //   this.toastr.displayErrorMessage('NMO','Please enter a valid email address or password');
    //  }
  }

  validateForm(email: string, password: string) {
    if (email.length === 0) {
      return false;
    }

    if (password.length === 0) {
      return false;
    }

    if (password.length < 6) {
      return false;
    }

    return true;
  }


  GetAllService() {

    this.service.GetAllService().subscribe(x => {
      if (x.ok == true) {
        this.serviceList = x.body.data;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
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
