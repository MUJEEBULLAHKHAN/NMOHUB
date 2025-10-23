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
import { ProjectRequestVM, ProjectRequest, RegisterUserVM, EmailVerifyModel } from '../../../models/new-service';
import { NMOService } from '../../../shared/services/new.service';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.scss'
})
export class CustomerRegisterComponent implements OnInit, OnDestroy {

  step: number = 1;
  lastStep: number = 2;
  _userInfo = null;
  isEmailVerificationStepComplete: boolean = false;
  showLoader: boolean = false;
  projectRequestVM = new ProjectRequestVM()
  projectRequest = new ProjectRequest()
  registerUserVM = new RegisterUserVM()
  emailVerifyModel = new EmailVerifyModel()
  emailOTP1!: number;
  emailOTP2!: number;
  emailOTP3!: number;
  emailOTP4!: number;
  emailOTP5!: number;
  emailOTP6!: number;
  countryList: any = [];

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
    this.GetAllCountry();
  }

  GoToNext() {
    if (this.step == 1) {

      if (this.registerUserVM.FullName == undefined || this.registerUserVM.FullName == null || this.registerUserVM.FullName == '') {
        this.toastr.displayErrorMessage("NMO", "Please Enter Name")
        return;
      }

      if (this.registerUserVM.CountryId == undefined || this.registerUserVM.CountryId == null || this.registerUserVM.CountryId <= 0) {
        this.toastr.displayErrorMessage("NMO", "Please Enter Country")
        return;
      }
      if (this.registerUserVM.DateOfBirth == undefined || this.registerUserVM.DateOfBirth == null || this.registerUserVM.DateOfBirth == '') {
        this.toastr.displayErrorMessage("NMO", "Please Enter DateOfBirth")
        return;
      }
      if (this.registerUserVM.MobileNumber == undefined || this.registerUserVM.MobileNumber == null || this.registerUserVM.MobileNumber == '') {
        this.toastr.displayErrorMessage("NMO", "Please Enter MobileNumber")
        return;
      }
      if (this.registerUserVM.EmailAddress == undefined || this.registerUserVM.EmailAddress == null || this.registerUserVM.EmailAddress == '') {
        this.toastr.displayErrorMessage("NMO", "Please Enter EmailAddress")
        return;
      }

      this.showLoader = true;

      this.authservice.RegisterEmpAuth(this.registerUserVM).subscribe({
        next: (user) => {
          if (user.body.success) {
            this.toastr.displaySuccessMessage('NMO', "OTP sent to your email");
            this.showLoader = false;
            this.step = this.step + 1;
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
  }

  GoToPrevious() {
    this.step = this.step - 1;
  }

  GoToStep(step: number) {

    // if (step == 1) {
    //   this.isEmailVerificationStepComplete = true;
    //   this.step = step;
    // }
    // else if (step == 2) {
    //   if (this.isEmailVerificationStepComplete) {
    //     this.step = step;
    //   }
    // } else {
    //   this.step = step;
    // }

  }


  SubmitRegistration() {

    if (this.emailOTP1 == undefined || this.emailOTP1 == null) {
      this.toastr.displayErrorMessage("NMO", "Please Enter OTP")
      return;
    }

    if (this.emailOTP2 == undefined || this.emailOTP2 == null) {
      this.toastr.displayErrorMessage("NMO", "Please Enter OTP")
      return;
    }

    if (this.emailOTP3 == undefined || this.emailOTP3 == null) {
      this.toastr.displayErrorMessage("NMO", "Please Enter OTP")
      return;
    }

    if (this.emailOTP4 == undefined || this.emailOTP4 == null) {
      this.toastr.displayErrorMessage("NMO", "Please Enter OTP")
      return;
    }

    if (this.emailOTP5 == undefined || this.emailOTP5 == null) {
      this.toastr.displayErrorMessage("NMO", "Please Enter OTP")
      return;
    }

    if (this.emailOTP6 == undefined || this.emailOTP6 == null) {
      this.toastr.displayErrorMessage("NMO", "Please Enter OTP")
      return;
    }


    this.showLoader = true;

    this.emailVerifyModel = new EmailVerifyModel()

    this.emailVerifyModel.Otp = (this.emailOTP1 + this.emailOTP2 + this.emailOTP3 + this.emailOTP4 + this.emailOTP5 + this.emailOTP6).toString();
    this.emailVerifyModel.EmailAddress = this.registerUserVM.EmailAddress;

    this.authservice.RegisterVerifyEmail(this.emailVerifyModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.toastr.displaySuccessMessage('NMO', "Project Created");

          this.router.navigate(['/home']);
          this.showLoader = false;
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


  GetAllCountry() {
    this.authservice.GetAllCountries().subscribe(x => {
      if (x.ok == true) {
        this.countryList = x.body;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }
    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
    });
  }
}
