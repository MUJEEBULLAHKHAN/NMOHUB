import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreacService } from '../../../shared/services/twsbservices/preac.service';
import { NMOService } from '../../../shared/services/new.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { PackageService } from '../../../shared/services/twsbservices/package.service';
import {
  EmailVerifyModel, PreAccelerator, RegisterUserVM, PreAcceleratorVM, DocumentData
} from '../../../models/preac.models';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preac-study-project',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './preac-study-project.component.html',
  styleUrl: './preac-study-project.component.scss'
})
export class PreacProjectComponent implements OnInit, OnDestroy {

  isRegistrationOTPByPass = false;
  step: number = 1;
  lastStep: number = 4;
  _userInfo = null;
  isEmailVerificationStepComplete: boolean = false;
  registerUserVM = new RegisterUserVM();
  emailVerifyModel = new EmailVerifyModel();
  projectRequest = new PreAccelerator();
  preAcceleratorVM = new PreAcceleratorVM();
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
  IsPitchDeckFile: boolean = false;
  IsBusinessModelCanvasFile: boolean = false;
  projectPhases: any = [];

  preacStep1Form!: FormGroup;
  preacStep2Form!: FormGroup;
  preacStep3Form!: FormGroup;
  preacStep4Form!: FormGroup;

  //   IsMarketResearchFile: boolean = false;
  //   countries: any = [];


  constructor(
    private route: ActivatedRoute,
    public preacService: PreacService,
    public authservice: NMOService,
    private router: Router,
    private toastr: DisplaymessageComponent,
    public service: ServiceApi,
    public packageService: PackageService,
    private formBuilder: FormBuilder

  ) {
    if (localStorage.getItem('userdetails') != null || localStorage.getItem('userdetails') != undefined) {
      this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
    }
    this.serviceId = this.route.snapshot.queryParamMap.get('serv');
  }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.GetConfigureValues()
    this.AllLookups();

    this.initStep1Form();
    this.initStep2Form();
    this.initStep3Form();
    this.initStep4Form();
  }

  initStep1Form() {
    this.preacStep1Form = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\+\d{1,3}\d{7,14}$/)]],
      linkedInProfileLink: ['', [Validators.pattern(/^https?:\/\/[^\s]+$/)]],
      priorPrograms: [null],
      priorProgramList: ['']
    });

    this.preacStep1Form.get('priorPrograms')?.valueChanges.subscribe(value => {
      const priorProgramListControl = this.preacStep1Form.get('priorProgramList');
      if (value === true || value === 'true') {
        priorProgramListControl?.setValidators([Validators.required, Validators.maxLength(200)]);
      } else {
        priorProgramListControl?.clearValidators();
      }
      priorProgramListControl?.updateValueAndValidity();
    });
  }

  initStep2Form() {
    this.preacStep2Form = this.formBuilder.group({
      startupName: ['', [Validators.required, Validators.minLength(2)]],
      currentStage: ['', [Validators.required]],
      problemSolved: ['', [Validators.required, Validators.maxLength(250)]],
      teamSize: [null, [Validators.required, Validators.min(1)]]
    });
  }

  initStep3Form() {
    this.preacStep3Form = this.formBuilder.group({
      hopeAchieve: ['', [Validators.maxLength(300)]], // Optional
      availability: [null, [Validators.required, Validators.min(0), Validators.max(168)]]
      // availability: [null, [Validators.required, greaterThan(1), Validators.max(168)]]
    });
  }

  initStep4Form() {
    this.preacStep4Form = this.formBuilder.group({
      businessModelCanvas: [null, [Validators.required]],
      pitchDeck: [null, [Validators.required]]
    });
  }

  get step1() {
    return this.preacStep1Form.controls;
  }
  get step2() { return this.preacStep2Form.controls; }
  get step3() { return this.preacStep3Form.controls; }
  get step4() { return this.preacStep4Form.controls; }


  AllLookups() {

    this.authservice.AllLookups().subscribe(x => {
      if (x.ok == true) {
        this.projectPhases = x.body.projectPhases;
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

      if (this.preacStep1Form.invalid) {
        this.preacStep1Form.markAllAsTouched();
        return;
      }

      // ✅ Sync form data to model
      const formData = this.preacStep1Form.value;
      this.registerUserVM.fullName = formData.fullName;
      this.registerUserVM.emailAddress = formData.emailAddress;
      this.registerUserVM.mobileNumber = formData.mobileNumber;
      this.registerUserVM.linkedInProfileLink = formData.linkedInProfileLink;
      this.projectRequest.priorPrograms = formData.priorPrograms;
      this.projectRequest.priorProgramList = formData.priorProgramList;

      this.step = this.step + 1;
      return;
    }


    if (this.step == 2) {
      if (this.preacStep2Form.invalid) {
        this.preacStep2Form.markAllAsTouched();
        return;
      }

      // ✅ Sync form data to model
      const formData = this.preacStep2Form.value;
      this.projectRequest.startupName = formData.startupName;
      this.projectRequest.currentStage = formData.currentStage;
      this.projectRequest.problemSolved = formData.problemSolved;
      this.projectRequest.teamSize = formData.teamSize;

      this.step = this.step + 1;
      return;
    }

    if (this.step == 3) {
      if (this.preacStep3Form.invalid) {
        this.preacStep3Form.markAllAsTouched();
        return;
      }

      // ✅ Sync form data to model
      const formData = this.preacStep3Form.value;
      this.projectRequest.hopeAchieve = formData.hopeAchieve;
      this.projectRequest.availability = formData.availability;

      this.step = this.step + 1;
      return;
    }

    if (this.step == 4) {
      if (this.preacStep4Form.invalid) {
        this.preacStep4Form.markAllAsTouched();
        return;
      }

      this.showLoader = true;

      let obj = {
        'EmailAddress': this.registerUserVM.emailAddress
      }

      this.preacService.SendOTP(obj).subscribe({
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

    this.preAcceleratorVM.emailverifyModel = this.emailVerifyModel;
    this.preAcceleratorVM.requestModel = this.projectRequest;
    this.preAcceleratorVM.userRegisterModel = this.registerUserVM;
    this.preAcceleratorVM.documentlist = this.documentList;


    this.preacService.CreateProject(this.preAcceleratorVM).subscribe({
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

    // if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "application/pdf")
    if (file.type === "application/pdf" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {

      //2MB = 2097152
      if (file.size > 2099000) {
        this.toastr.displayErrorMessage('NMO', "Please Select Max 2 MB File");
        return;
      }

      var document = this.documentList.filter(x => x.DocumentType == documentType)

      if (document.length > 0) {
        this.toastr.displayErrorMessage("NMO", DocumentType + " Already Exist If you Upload Again Then Remove First")
        return;
      }

      if (file != null) {

        if (documentType == "Business Model Canvas") {
          this.IsBusinessModelCanvasFile = true;
        }

        if (documentType == "Pitch Deck") {
          this.IsPitchDeckFile = true;
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
      // this.toastr.displayErrorMessage('NMO', "Please Select JPEG OR PDF OR PDF");
      this.toastr.displayErrorMessage('NMO', "Please Select DOCX or PDF only");

      return;
    }


  }

  SubmitWithoutOTP() {

    if (this.preacStep4Form.invalid) {
      this.preacStep4Form.markAllAsTouched();
      return;
    }

    this.showLoader = true;

    if (this.isRegistrationOTPByPass == false) {
      this.emailVerifyModel.Otp = (this.emailOTP1 + this.emailOTP2 + this.emailOTP3 + this.emailOTP4 + this.emailOTP5 + this.emailOTP6).toString();
    }

    this.emailVerifyModel.EmailAddress = this.registerUserVM.emailAddress;

    this.preAcceleratorVM.emailverifyModel = this.emailVerifyModel;
    this.preAcceleratorVM.requestModel = this.projectRequest;
    this.preAcceleratorVM.userRegisterModel = this.registerUserVM;
    this.preAcceleratorVM.documentlist = this.documentList;


    this.preacService.CreateProject(this.preAcceleratorVM).subscribe({
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

    if (ProjectType == "Business Model Canvas") {
      this.IsBusinessModelCanvasFile = false;
    }

    if (ProjectType == "Pitch Deck") {
      this.IsPitchDeckFile = false;
    }

  }



  GetConfigureValues() {

    this.authservice.GetConfigureValues().subscribe(x => {
      if (x.ok == true) {
        this.Confi = x.body[0];
        //this.isRegistrationOTPByPass = Boolean(this.Confi.value);


        if (this.Confi.value == "false") {
          this.isRegistrationOTPByPass = false;
          this.lastStep = 5;
        }

        if (this.Confi.value == "true") {
          this.lastStep = 4;
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
export function greaterThan(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value !== null && control.value <= min) {
      return { greaterThan: { requiredValue: min, actualValue: control.value } };
    }
    return null;
  };
}