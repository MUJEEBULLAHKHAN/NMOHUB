import { Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../../shared/models/authentication';
import { UserAuthService } from '../../../shared/services/twsbservices/user-auth.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { Service, Package } from '../../../models/Reference';
import { PackageService } from '../../../shared/services/twsbservices/package.service';
import { NMOService } from '../../../shared/services/new.service';

@Component({
  selector: 'app-auth/login',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.scss'
})

export class CustomerLoginComponent implements OnInit, OnDestroy {

  authentication = new authentication();
  showLoader: boolean = false;
  role!: string;
  roleId!: any;

  _userInfo = null;
  public _userDetails: any
  constructor(
    public authservice: NMOService,
    private elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastr: DisplaymessageComponent,
    public service: ServiceApi,
    private modalService: NgbModal,
    public packageService: PackageService,
  ) {
    if (localStorage.getItem('userdetails') != null || localStorage.getItem('userdetails') != undefined) {
      var roles = JSON.parse(localStorage.getItem('roles') ?? '');
      this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
      console.log("USER INFO IS ", this._userInfo);
    }
  }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }


  ngOnInit(): void {

  }

  login() {

    localStorage.removeItem('token');

    if (this.validateForm(this.authentication.emailAddress, this.authentication.password)) {
      this.showLoader = true;
      this.authservice.CustomerLogin(this.authentication).subscribe({
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
  
            if (this.roleId == "10") {
              this.router.navigate(['dashboard-overview']);
            }
            else if (this.roleId == "1") {
              this.router.navigate(['home']);
            }
            else if (this.roleId == "9") {
              this.router.navigate(['expert-availability-list']);
            }

          }
          else {
            this.toastr.displayErrorMessage('NMO', user.body.message);
            this.showLoader = false;
          }
        },
        error: (error) => {
          this.toastr.displayErrorMessage('NMO', error.error.message);
          this.showLoader = false;
          return;
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
