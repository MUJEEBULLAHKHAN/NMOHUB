import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../shared/models/authentication';
import { UserAuthService } from '../../shared/services/twsbservices/user-auth.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../shared/components/displaymessage/displaymessage.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  authentication = new authentication();
  disabled = '';
  active: any;
  showLoader: boolean | undefined;
  public loginForm!: FormGroup;
  public error: any = '';
  showPassword = false;
  toggleClass = "ri-eye-off-line";

  role!: string;
  roleId!: number;

  public _userDetails: any

  constructor(
    public authservice: UserAuthService,
    private elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastr: DisplaymessageComponent
  ) {

  }


  ngOnInit(): void {


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


    if (this.validateForm(this.authentication.emailAddress, this.authentication.password)) {
      this.showLoader = true;
      this.authservice.Login(this.authentication).subscribe({
        next: (user) => {
          if (user.body.success) {
            console.log(user.body);
            this._userDetails = JSON.stringify(user.body);
            localStorage.setItem('userinfo', this._userDetails);
            localStorage.setItem('roles', JSON.stringify(user.body['roles']));
            localStorage.setItem('token', JSON.stringify(user.body['token']));
            localStorage.setItem('userdetails', JSON.stringify(user.body['userDetails']));
            this.router.navigate(['dashboard-overview']);

            var roles = JSON.parse(localStorage.getItem('roles') ?? '');
            console.log("Role INFO IS ", roles);
            this.role = roles[0].name;
            this.roleId = roles[0].id;

            if (this.roleId == 10) {
              this.router.navigate(['dashboard-overview']);
            }
            else if (this.roleId == 1) {
              this.router.navigate(['home']);
            }
            else {
              this.router.navigate(['dashboard-overview']);
            }


          }
          else {
            this.toastr.displayErrorMessage('NMO', user.body.message);
            this.showLoader = false;
          }
        },
        error: (error) => {
          this.toastr.displayErrorMessage('NMO', error);
          this.showLoader = false;
        },
        complete: () => {
          this.showLoader = false;
        }
      });
    }
    else {
      this.toastr.displayErrorMessage('NMO', 'Please enter a valid email address or password');
    }
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
}
