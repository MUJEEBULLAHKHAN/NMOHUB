import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeasService } from '../../../shared/services/twsbservices/feas.service';
import { NMOService } from '../../../shared/services/new.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { PackageService } from '../../../shared/services/twsbservices/package.service';
import {
  EmailVerifyModel, FeasibilityStudy, RegisterUserVM, FeasibilityStudyVM, DocumentData
} from '../../../models/feasibility-study.models';


import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-feasibility-study-project',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './feasibility-study-project.component.html',
  styleUrl: './feasibility-study-project.component.scss'
})
export class FeasibilityStudyProjectComponent implements OnInit, OnDestroy {

  isRegistrationOTPByPass = false;
  step: number = 1;
  lastStep: number = 3;
  _userInfo = null;
  isEmailVerificationStepComplete: boolean = false;
  registerUserVM = new RegisterUserVM();
  emailVerifyModel = new EmailVerifyModel();
  projectRequest = new FeasibilityStudy();
  feasibilityStudyVM = new FeasibilityStudyVM();
  emailOTP1!: number;
  emailOTP2!: number;
  emailOTP3!: number;
  emailOTP4!: number;
  emailOTP5!: number;
  emailOTP6!: number;
  showLoader: boolean | undefined;
  role!: string;
  roleId!: number;
  public _userDetails: any
  Confi: any = [];
  documentList: DocumentData[] = [];
  serviceId: any;
  IsFinancialSpreadsheetsFile: boolean = false;
  IsBackgroundMarketReportsFile: boolean = false;
  IsMarketResearchFile: boolean = false;
  countries: any = [];
  feasibilityFormStep1!: FormGroup;
  feasibilityFormStep2!: FormGroup;
  feasibilityFormStep3!: FormGroup;



  industry_sectors = [
    'Agriculture-Farming', 'Agriculture-Forestry', 'Agriculture-Fishing', 'Agriculture-Mining',
    'Energy-Renewable Energy', 'Energy-Oil & Gas', 'Energy-Utilities (Water, Electricity, Gas)',
    'Technology-Information Technology (IT)', 'Technology-Software Development', 'Technology-Hardware Manufacturing', 'Technology-Telecommunications',
    'Manufacturing-Automobiles', 'Manufacturing-Electronics', 'Manufacturing-Textiles', 'Manufacturing-Chemicals', 'Manufacturing-Food & Beverage',
    'Construction-Residential', 'Construction-Commercial', 'Construction-Industrial', 'Construction-Infrastructure',
    'Retail-E-commerce', 'Retail-Brick-and-mortar stores', 'Retail-Wholesale',
    'Healthcare-Hospitals', 'Healthcare-Pharmaceuticals', 'Healthcare-Biotechnology', 'Healthcare-Medical Devices',
    'Finance-Banking', 'Finance-Insurance', 'Finance-Investment Management', 'Finance-Real Estate',
    'Transportation-Aviation', 'Transportation-Shipping & Logistics', 'Transportation-Railways', 'Transportation-Automotive',
    'Education-Primary & Secondary Education', 'Education-Higher Education', 'Education-Vocational Training', 'Education-Online Learning',
    'Hospitality-Hotels & Resorts', 'Hospitality-Restaurants', 'Hospitality-Travel & Tourism',
    'Entertainment-Film & Television', 'Entertainment-Music', 'Entertainment-Sports', 'Entertainment-Gaming',
    'Government & Public Services-Public Administration', 'Government & Public Services-Defense', 'Government & Public Services-Law Enforcement', 'Government & Public Services-Nonprofits',
    'Legal-Law Firms', 'Legal-Legal Services', 'Legal-Intellectual Property',
    'Real Estate-Residential Properties', 'Real Estate-Commercial Properties', 'Real Estate-Property Management'
  ]


  constructor(
    private route: ActivatedRoute,
    public feasService: FeasService,
    public authservice: NMOService,
    private router: Router,
    private toastr: DisplaymessageComponent,
    public service: ServiceApi,
    public packageService: PackageService,
    private fb: FormBuilder,
    private fb2: FormBuilder,
    private fb3: FormBuilder,

  ) {
    if (localStorage.getItem('userdetails') != null || localStorage.getItem('userdetails') != undefined) {
      this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
    }
    this.serviceId = this.route.snapshot.queryParamMap.get('serv');

    this.FeasibilityFormStep1();
    this.FeasibilityFormStep2V();
    this.FeasibilityFormStep3V();

  }

  FeasibilityFormStep1() {
    this.feasibilityFormStep1 = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), this.alphaValidator]],
      emailAddress: ['', [Validators.required, Validators.email]],
      mobileNumber: ['+', [Validators.required, this.phoneValidator]],
      Organization: [''], // optional
      CountryId: [null, [Validators.required]]
    });
  };

  // ✅ Only alphabets + spaces allowed
  alphaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(control.value) ? null : { alphabetic: true };
  }

  // ✅ Country code + number validation (basic)
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    // Example: +966XXXXXXXXX
    const regex = /^\+\d{6,15}$/;
    return regex.test(control.value) ? null : { invalidPhone: true };
  }

  FeasibilityFormStep2V() {
    this.feasibilityFormStep2 = this.fb2.group({
      ProjectName: ['', [Validators.required, Validators.minLength(3)]],
      IndustrySector: [null, [Validators.required]],
      EstimatedBudget: [null, [Validators.required, Validators.min(1)]],
      StudyObjectives: ['', [Validators.required, Validators.maxLength(300)]],
      KeyAssumptions: ['', [Validators.maxLength(200)]],
      HasMarketResearch: [null, [Validators.required]],
    });
  };
  FeasibilityFormStep3V() {
    this.feasibilityFormStep3 = this.fb3.group({
      FinancialSpreadsheets: [null], // optional
      BackgroundMarket: [null],      // optional
      MarketResearch: [null]         // conditional
    });

    this.feasibilityFormStep2.get('HasMarketResearch')?.valueChanges.subscribe(value => {
      const mockupFileControl = this.feasibilityFormStep3.get('MarketResearch');
      if (value === true) {
        mockupFileControl?.setValidators([Validators.required]);
      } else {
        mockupFileControl?.clearValidators();
      }
      mockupFileControl?.updateValueAndValidity();
    });
  }

  // Convenience getter
  get f() {
    return this.feasibilityFormStep1.controls;
  }
  get fStep2() {
    return this.feasibilityFormStep2.controls;
  }
  get fStep3() {
    return this.feasibilityFormStep3.controls;
  }


  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.GetConfigureValues()
    this.AllLookups();
  }

  AllLookups() {

    this.authservice.AllLookups().subscribe(x => {
      if (x.ok == true) {
        this.countries = x.body.countries;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }

  GoToNext() {

    if (this.step == 1) {

      if (this.feasibilityFormStep1.invalid) {
        this.feasibilityFormStep1.markAllAsTouched();
        return;
      }

      this.registerUserVM = {
        ...this.registerUserVM,
        ...this.feasibilityFormStep1.value
      };

      this.step = this.step + 1;
      return;
    }


    if (this.step == 2) {
      if (this.feasibilityFormStep2.invalid) {
        this.feasibilityFormStep2.markAllAsTouched();
        return;
      }

      this.projectRequest = {
        ...this.projectRequest, // keep any values from step 1
        ...this.feasibilityFormStep2.value
      };


      this.step = this.step + 1;
      return;
    }

    if (this.step == 3) {
      if (this.feasibilityFormStep3.invalid) {
        this.feasibilityFormStep3.markAllAsTouched();
        return;
      }

      this.step = this.step + 1;
      return;
    }

    if (this.step == 4) {


      this.showLoader = true;

      let obj = {
        'EmailAddress': this.registerUserVM.emailAddress
      }

      this.feasService.SendOTP(obj).subscribe({
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
          this.toastr.displayErrorMessage('NMO', error.error.message);
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

  GoToStep() {

    // if (step == 4) {
    //   this.isEmailVerificationStepComplete = true;
    //   this.step = step;
    // }
    // else if (step == 5) {
    //   if (this.isEmailVerificationStepComplete) {
    //     this.step = step;
    //   }
    // } else {
    //   this.step = step;
    // }

  }

  SubmitProject() {

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


    this.emailVerifyModel.Otp = (this.emailOTP1 + this.emailOTP2 + this.emailOTP3 + this.emailOTP4 + this.emailOTP5 + this.emailOTP6).toString();
    this.emailVerifyModel.EmailAddress = this.registerUserVM.emailAddress;

    this.feasibilityStudyVM.emailverifyModel = this.emailVerifyModel;
    this.feasibilityStudyVM.requestModel = this.projectRequest;
    this.feasibilityStudyVM.userRegisterModel = this.registerUserVM;
    this.feasibilityStudyVM.documentlist = this.documentList;


    this.feasService.CreateProject(this.feasibilityStudyVM).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.toastr.displaySuccessMessage('NMO', "Project Created");

          this.router.navigate(['/customer-project-confirmation'], {
            queryParams: {
              caseid: user.body.projectId || user.body.caseId, // Use the ID returned from API
              fullName: (this._userInfo as any)?.firstNames || '',
              id: (this._userInfo as any)?.employeeId || user.body.userId || '', // Use existing user ID or from response
              Serv: this.serviceId
            }
          });
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

  moveToNext(event: KeyboardEvent, nextInput?: any, prevInput?: any) {
    const input = event.target as HTMLInputElement;

    // Move to next if value entered
    if (input.value && nextInput) {
      nextInput.focus();
    }

    // Move to previous on backspace if empty
    if (event.key === 'Backspace' && !input.value && prevInput) {
      prevInput.focus();
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') ?? '';

    if (!/^\d+$/.test(pasteData)) return;

    const digits = pasteData.slice(0, 6).split('');

    this.emailOTP1 = digits[0] ? +digits[0] : undefined!;
    this.emailOTP2 = digits[1] ? +digits[1] : undefined!;
    this.emailOTP3 = digits[2] ? +digits[2] : undefined!;
    this.emailOTP4 = digits[3] ? +digits[3] : undefined!;
    this.emailOTP5 = digits[4] ? +digits[4] : undefined!;
    this.emailOTP6 = digits[5] ? +digits[5] : undefined!;

    const inputs = document.querySelectorAll<HTMLInputElement>('.otp-inputs input');
    const nextIndex = digits.length < 6 ? digits.length : 5;
    inputs[nextIndex].focus();
  }



  onFileSelected(event: any, documentType: any) {

    let fileList: FileList = event.target.files;
    if (fileList.length < 1) {
      return;
    }

    let file: File = fileList[0];

    if (file == null || file == undefined) {
      this.toastr.displayErrorMessage('NMO', "Please Select A File");
      return;
    }

    if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "application/pdf") {

      if (documentType === "Market Research") {
        if (file.size > 10 * 1024 * 1024) { // 10 MB
          this.toastr.displayErrorMessage('NMO', "Market Research file must be less than 10 MB");
          return;
        }
      } else {
        if (file.size > 2 * 1024 * 1024) { // 2 MB
          this.toastr.displayErrorMessage('NMO', "Please Select Max 2 MB File");
          return;
        }
      }

      var document = this.documentList.filter(x => x.DocumentType == documentType)

      if (document.length > 0) {
        this.toastr.displayErrorMessage("NMO", DocumentType + " Already Exist If you Upload Again Then Remove First")
        return;
      }


      if (file != null) {

        if (documentType == "Market Research") {
          this.IsMarketResearchFile = true;
        }

        if (documentType == "Background Market Reports") {
          this.IsBackgroundMarketReportsFile = true;
        }

        if (documentType == "Financial Spreadsheets") {
          this.IsFinancialSpreadsheetsFile = true;
        }

        let document = new DocumentData();
        document.DocumentType = documentType;
        document.Extension = this.getFileExtension(file.name);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          document.Base64Data = this.cleanBase64Data(reader.result);
          this.documentList.push(document);
        };

      }
    }
    else {
      this.toastr.displayErrorMessage('NMO', "Please Select JPEG OR PDF OR PDF");
      return;
    }


  }

  SubmitWithoutOTP() {

    if (this.feasibilityFormStep3.invalid) {
      this.feasibilityFormStep3.markAllAsTouched();
      return;
    }


    this.showLoader = true;

    if (this.isRegistrationOTPByPass == false) {
      this.emailVerifyModel.Otp = (this.emailOTP1 + this.emailOTP2 + this.emailOTP3 + this.emailOTP4 + this.emailOTP5 + this.emailOTP6).toString();
    }

    this.emailVerifyModel.EmailAddress = this.registerUserVM.emailAddress;

    this.feasibilityStudyVM.emailverifyModel = this.emailVerifyModel;
    this.feasibilityStudyVM.requestModel = this.projectRequest;
    this.feasibilityStudyVM.userRegisterModel = this.registerUserVM;
    this.feasibilityStudyVM.documentlist = this.documentList;


    this.feasService.CreateProject(this.feasibilityStudyVM).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.toastr.displaySuccessMessage('NMO', "Project Created");
          this.router.navigate(['/customer-project-confirmation'], {
            queryParams: {
              caseid: user.body.projectId || user.body.caseId, // Use the ID returned from API
              fullName: (this._userInfo as any)?.firstNames || '',
              id: (this._userInfo as any)?.employeeId || user.body.userId || '', // Use existing user ID or from response
              Serv: this.serviceId
            }
          });
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

  cleanBase64Data(data: any): string {
    return data.replace(/^data:[^;]+;base64,/, '');
  }

  getFileExtension(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase(); // Get the part after the last dot and convert to lowercase
    return ("." + extension) || ''; // Return the extension or an empty string if no extension is found
  }

  RemoveFile(ProjectType: any) {
    this.documentList = this.documentList.filter(x => x.DocumentType != ProjectType);

    if (ProjectType == "Market Research") {
      this.IsMarketResearchFile = false;
    }

    if (ProjectType == "Background Market Reports") {
      this.IsBackgroundMarketReportsFile = false;
    }

    if (ProjectType == "Financial Spreadsheets") {
      this.IsFinancialSpreadsheetsFile = false;
    }

  }



  GetConfigureValues() {

    this.authservice.GetConfigureValues().subscribe(x => {
      if (x.ok == true) {
        this.Confi = x.body[0];
        //this.isRegistrationOTPByPass = Boolean(this.Confi.value);


        if (this.Confi.value == "false") {
          this.isRegistrationOTPByPass = false;
          this.lastStep = 4;
        }

        if (this.Confi.value == "true") {
          this.lastStep = 3;
          this.isRegistrationOTPByPass = true;
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }


}