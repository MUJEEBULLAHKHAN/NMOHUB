import { Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../../shared/models/authentication';
import { UserAuthService } from '../../../shared/services/twsbservices/user-auth.service';
import { NMOService } from '../../../shared/services/new.service';
import { MVPService } from '../../../shared/services/twsbservices/mvp.service';
import { CommonModule, NgIf } from '@angular/common';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { Service, Package } from '../../../models/Reference';
import { PackageService } from '../../../shared/services/twsbservices/package.service';
import {
  ProjectRequestVM, ProjectRequest, RegisterUserVM, EmailVerifyModel, SupportNeeds, Partner, OtherProgramAttend,
  DocumentData
} from '../../../models/new-service';

import { MVPProgramVM, MvpProgram, Skill, MVPEmailVerifyModel, MVPRegisterUserVM, MVPDocumentData } from '../../../models/MVPModel';

import { ActivatedRoute } from '@angular/router';

import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-customer-project',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule, NgIf],
  providers: [DisplaymessageComponent],
  templateUrl: './customer-project.component.html',
  styleUrl: './customer-project.component.scss'
})
export class CustomerProjectComponent implements OnInit, OnDestroy {
  isRegistrationOTPByPass = false;
  step: number = 1;
  lastStep: number = 4;
  _userInfo = null;
  isEmailVerificationStepComplete: boolean = false;
  mvpStep1Form!: FormGroup;
  mvpProgramForm!: FormGroup;
  mvpProgramFormStep3!: FormGroup;
  mvpProgramFormStep4!: FormGroup;


  projectRequestVM = new ProjectRequestVM();
  projectRequest = new ProjectRequest();
  registerUserVM = new RegisterUserVM();
  emailVerifyModel = new EmailVerifyModel();
  mvpProgram = new MvpProgram();
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
  countries: any = [];
  projectAreas: any = [];
  projectPhases: any = [];
  partner = new Partner();
  otherProgramAttend = new OtherProgramAttend();
  supportNeeds!: SupportNeeds[];
  selectedNeeds: SupportNeeds[] = [];
  documentList: DocumentData[] = [];
  // New property to hold the formatted string
  formattedSelectedNeeds: string = '';
  IsProjectDocumentFile: boolean = false;
  IsOtherDocumentFile: boolean = false;
  serviceId: any;

  // MVP Service 
  mVPProgramVM = new MVPProgramVM();
  mvpProgramModel = new MvpProgram();
  skill!: Skill[];
  IsDesignAssets: boolean = false;
  IsAPISpecifications: boolean = false;
  IsUIMockupsUploaded: boolean = false;
  mVPEmailVerifyModel = new MVPEmailVerifyModel();
  mVPRegisterUserVM = new MVPRegisterUserVM();
  formattedSelectedSkills: string = '';

  Skills = [
    { Id: 1, skillName: "React", isChecked: false },
    { Id: 2, skillName: "Angular", isChecked: false },
    { Id: 3, skillName: "Vue.js", isChecked: false },
    { Id: 4, skillName: "Node.js", isChecked: false },
    { Id: 5, skillName: "Python", isChecked: false },
    { Id: 6, skillName: "Django", isChecked: false },
    { Id: 7, skillName: "ASP.NET Core", isChecked: false },
    { Id: 8, skillName: "Java (Spring Boot)", isChecked: false },
    { Id: 9, skillName: "Flutter", isChecked: false },
    { Id: 10, skillName: "DevOps (Docker, CI/CD)", isChecked: false }
  ];


  constructor(
    private route: ActivatedRoute,
    public authservice: NMOService,
    public mVPService: MVPService,
    private elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastr: DisplaymessageComponent,
    public service: ServiceApi,
    private modalService: NgbModal,
    public packageService: PackageService,
    private mvpfb: FormBuilder,
    private mvpProgramFb: FormBuilder,
    private mvpProgramStep3: FormBuilder,
    private mvpProgramStep4: FormBuilder

  ) {
    if (localStorage.getItem('userdetails') != null || localStorage.getItem('userdetails') != undefined) {
      var roles = JSON.parse(localStorage.getItem('roles') ?? '');
      this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
    }
    this.serviceId = this.route.snapshot.queryParamMap.get('serv');
    this.initmvpStep1Form();
    this.mvpProgramValidate();
    this.mvpProgramStep3Validate();


  }
  initmvpStep1Form() {
    this.mvpStep1Form = this.mvpfb.group({
      FullName: ['', [Validators.required, Validators.minLength(2)]],
      EmailAddress: ['', [Validators.required, Validators.email]],
      MobileNumber: ['+', [Validators.required, Validators.pattern(/^\+\d{1,3}\d{7,14}$/),],],
    });
  }

  nextStep() {
    if (this.step === 1) {
      if (this.mvpStep1Form.invalid) {
        this.mvpStep1Form.markAllAsTouched();
        return;
      }
      this.step++;
    }
  }

  get f() {
    return this.mvpStep1Form.controls;
  }

  mvpProgramValidate() {
    this.mvpProgramForm = this.mvpProgramFb.group({
      projectName: ['', [Validators.required, Validators.minLength(2)]],
      projectDescription: ['', [Validators.required, Validators.maxLength(300)]],
      desiredTechStack: [[], [Validators.required]],
      uiMockupsUploaded: [null, [Validators.required]],
      prototypeLink: ['', [Validators.pattern(/https?:\/\/[^\s]+/)]],

    });

    this.mvpProgramForm.get('uiMockupsUploaded')?.valueChanges.subscribe(value => {
      const mockupFileControl = this.mvpProgramForm.get('mockupFile');
      if (value === true) {
        mockupFileControl?.setValidators([Validators.required]);
      } else {
        mockupFileControl?.clearValidators();
      }
      mockupFileControl?.updateValueAndValidity();
    });
  }
  mvpProgramStep3Validate() {
    this.mvpProgramFormStep3 = this.mvpProgramStep3.group({
      desiredLaunchDate: ['', [Validators.required, this.futureDateValidator]],
      estimatedBudget: [null, [Validators.required, Validators.min(1)]],
    });

  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time
    return selected > today ? null : { notFuture: true };
  }


  onSkillChange(event: any, skill: any) {
    const selected = this.mvpV['desiredTechStack'].value as string[];
    if (event.target.checked) {
      selected.push(skill.skillName);
    } else {
      const index = selected.indexOf(skill.skillName);
      if (index >= 0) selected.splice(index, 1);
    }
    this.mvpV['desiredTechStack'].setValue([...selected]);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/octet-stream'];
      if (!allowedTypes.includes(file.type)) {
        this.toastr.displayErrorMessage("NMO", "Invalid file type (PNG, JPG, Figma only)");
        this.mvpV['mockupFile'].setValue(null);
        return;
      }
      this.mvpV['mockupFile'].setValue(file);
    }
  }

  mvpProgramStep4Validate() {
    this.mvpProgramFormStep4 = this.mvpProgramStep4.group({
      apiSpecifications: [null],
      designAssets: [null],
      mockupFile: [null]
    });

    // conditional validator → mockup file required if `uiMockupsUploaded` is true
    this.mvpProgramForm.get('uiMockupsUploaded')?.valueChanges.subscribe(value => {
      const mockupFileControl = this.mvpProgramFormStep4.get('mockupFile');
      if (value === true) {
        mockupFileControl?.setValidators([Validators.required]);
      } else {
        mockupFileControl?.clearValidators();
      }
      mockupFileControl?.updateValueAndValidity();
    });
  }

  get mvpV() {
    return this.mvpProgramForm.controls;
  }
  get mvpStep3V() {
    return this.mvpProgramFormStep3.controls;
  }
  get mvpStep4V() {
    return this.mvpProgramFormStep4.controls;
  }

  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.GetConfigureValues()
    this.AllLookups();
    this.initmvpStep1Form();
    this.mvpProgramValidate();
    this.mvpProgramStep3Validate();
    this.mvpProgramStep4Validate();
  }
  // GetAllCountry() {
  //   throw new Error('Method not implemented.');
  // }

  GoToNext() {


    if (this.serviceId == 1) {
      if (this.step == 1) {

        if (this.registerUserVM.FullName == undefined || this.registerUserVM.FullName == null || this.registerUserVM.FullName == '') {
          this.toastr.displayErrorMessage("NMO", "Please Enter Name")
          return;
        }

        if (this.registerUserVM.CountryId == undefined || this.registerUserVM.CountryId == null || this.registerUserVM.CountryId <= 0) {
          this.toastr.displayErrorMessage("NMO", "Please Enter CountryId")
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

        this.step = this.step + 1;
        return;
      }


      if (this.step == 2) {

        if (this.projectRequest.ProjectName == undefined || this.projectRequest.ProjectName == null || this.projectRequest.ProjectName == '') {
          this.toastr.displayErrorMessage("NMO", "Please Enter Project Name")
          return;
        }

        if (this.projectRequest.ProjectPhaseId == undefined || this.projectRequest.ProjectPhaseId == null || this.projectRequest.ProjectPhaseId <= 0) {
          this.toastr.displayErrorMessage("NMO", "Please Select Current Phase")
          return;
        }

        if (this.projectRequest.ProjectAreaID == undefined || this.projectRequest.ProjectAreaID == null || this.projectRequest.ProjectAreaID <= 0) {
          this.toastr.displayErrorMessage("NMO", "Please Select Project Area")
          return;
        }


        if (this.projectRequest.AlreadyParticipatedProgram == undefined || this.projectRequest.AlreadyParticipatedProgram == null) {
          this.toastr.displayErrorMessage("NMO", "Please Enter Already Participated Program")
          return;
        }

        if (this.projectRequest.AlreadyParticipatedProgram == undefined || this.projectRequest.AlreadyParticipatedProgram == null) {
          this.toastr.displayErrorMessage("NMO", "Please Enter Already Participated Program")
          return;
        }

        if (this.projectRequest.BriefDescription == undefined || this.projectRequest.BriefDescription == null || this.projectRequest.BriefDescription == '') {
          this.toastr.displayErrorMessage("NMO", "Please Enter Brief Description")
          return;
        }
        this.step = this.step + 1;
        return;
      }

      if (this.step == 3) {

        if (this.projectRequest.IsPartnerAvailable == undefined || this.projectRequest.IsPartnerAvailable == null) {
          this.toastr.displayErrorMessage("NMO", "Please Select Is Partner Available")
          return;
        }

        if (this.projectRequest.IsWrittenBusinessPlan == undefined || this.projectRequest.IsWrittenBusinessPlan == null) {
          this.toastr.displayErrorMessage("NMO", "Please Enter Business Plan")
          return;
        }

        if (this.projectRequest.HopeAchieve == undefined || this.projectRequest.HopeAchieve == null || this.projectRequest.HopeAchieve == '') {
          this.toastr.displayErrorMessage("NMO", "Please Enter What Goals Do You Want To Achieve")
          return;
        }

        this.selectedNeeds = this.supportNeeds.filter(x => x.isChecked)

        if (this.selectedNeeds.length <= 0) {
          this.toastr.displayErrorMessage("NMO", "Please Select Supports Needs")
          return;
        }

        this.formatSelectedNeeds();

        this.step = this.step + 1;
        return;
      }

      if (this.step == 4) {


        this.showLoader = true;

        let obj = {
          'EmailAddress': this.registerUserVM.EmailAddress
        }

        this.authservice.SendOTP(obj).subscribe({
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


    // Second Service

    if (this.serviceId == 2) {
      if (this.step == 1) {
        if (this.mvpStep1Form.invalid) {
          this.mvpStep1Form.markAllAsTouched(); // ✅ show errors
          return;
        }

        const formData = this.mvpStep1Form.value;
        this.registerUserVM.FullName = formData.FullName;
        this.registerUserVM.EmailAddress = formData.EmailAddress;
        this.registerUserVM.MobileNumber = formData.MobileNumber;

        this.step = this.step + 1;
        return;
      }


      if (this.step == 2) {
        if (this.mvpProgramForm.invalid) {
          this.mvpProgramForm.markAllAsTouched();
          return;
        }

        // ✅ Sync form values to model
        const formData = this.mvpProgramForm.value;
        this.mvpProgram.projectName = formData.projectName;
        this.mvpProgram.projectDescription = formData.projectDescription;
        this.mvpProgram.prototypeLink = formData.prototypeLink;
        this.mvpProgram.uiMockupsUploaded = formData.uiMockupsUploaded;

        this.formattedSelectedSkills = formData.desiredTechStack.join(', ');

        this.step = this.step + 1;
        return;
      }

      if (this.step == 3) {
        if (this.mvpProgramFormStep3.invalid) {
          this.mvpProgramFormStep3.markAllAsTouched();
          return;
        }
        const formData = this.mvpProgramFormStep3.value;
        this.mvpProgram.desiredLaunchDate = formData.desiredLaunchDate;
        this.mvpProgram.estimatedBudget = formData.estimatedBudget;
        this.step = this.step + 1;
        return;
      }

      if (this.step == 4) {

        if (this.mvpProgramFormStep4.invalid) {
          this.mvpProgramFormStep4.markAllAsTouched();
          return;
        }

        this.showLoader = true;

        let obj = {
          'EmailAddress': this.registerUserVM.EmailAddress || this.mvpStep1Form.get('EmailAddress')?.value
        }

        this.authservice.SendOTP(obj).subscribe({
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



  }

  GoToPrevious() {
    this.step = this.step - 1;
  }

  GoToStep(step: number) {

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
    // ✅ Validate OTP inputs
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

    // ✅ Prepare OTP string
    const otpString = (this.emailOTP1 + this.emailOTP2 + this.emailOTP3 + this.emailOTP4 + this.emailOTP5 + this.emailOTP6).toString();

    // ✅ Handle Service 1 (Original Project Service)
    if (this.serviceId == 1) {
      this.emailVerifyModel.Otp = otpString;
      this.emailVerifyModel.EmailAddress = this.registerUserVM.EmailAddress;

      this.projectRequestVM.emailverifyModel = this.emailVerifyModel;
      this.projectRequestVM.requestModel = this.projectRequest;
      this.projectRequestVM.userRegisterModel = this.registerUserVM;
      this.projectRequestVM.otherProgramAttend = this.otherProgramAttend;
      this.projectRequestVM.partner = this.partner;
      this.projectRequestVM.documentlist = this.documentList;

      this.authservice.CreateProject(this.projectRequestVM).subscribe({
        next: (user) => {
          if (user.body.success) {
            this.toastr.displaySuccessMessage('NMO', "Project Created");

            this.router.navigate(['/customer-project-confirmation'], {
              queryParams: {
                caseid: user.body.projectId || user.body.caseId,
                fullName: (this._userInfo as any)?.firstNames || '',
                id: (this._userInfo as any)?.employeeId || user.body.userId || '',
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

    // ✅ Handle Service 2 (MVP Service)
    if (this.serviceId == 2) {
      // ✅ Sync all form data to models before submission
      const step1Data = this.mvpStep1Form.value;
      this.registerUserVM.FullName = step1Data.FullName;
      this.registerUserVM.EmailAddress = step1Data.EmailAddress;
      this.registerUserVM.MobileNumber = step1Data.MobileNumber;

      const step2Data = this.mvpProgramForm.value;
      this.mvpProgram.projectName = step2Data.projectName;
      this.mvpProgram.projectDescription = step2Data.projectDescription;
      this.mvpProgram.prototypeLink = step2Data.prototypeLink;
      this.mvpProgram.uiMockupsUploaded = step2Data.uiMockupsUploaded;

      const step3Data = this.mvpProgramFormStep3.value;
      this.mvpProgram.desiredLaunchDate = step3Data.desiredLaunchDate;
      this.mvpProgram.estimatedBudget = step3Data.estimatedBudget;

      // ✅ Prepare MVP models
      this.mVPEmailVerifyModel.otp = otpString; // ✅ Set OTP
      this.mVPEmailVerifyModel.emailAddress = this.registerUserVM.EmailAddress;

      this.mVPProgramVM.emailverifyModel = this.mVPEmailVerifyModel;
      this.mVPProgramVM.requestModel = this.mvpProgram;
      this.mVPProgramVM.requestModel.desiredTechStack = step2Data.desiredTechStack.join(', '); // ✅ Use form data
      this.mVPProgramVM.userRegisterModel = Object.assign(new MVPRegisterUserVM(), this.registerUserVM);
      this.mVPProgramVM.documentlist = this.documentList.map(obj => Object.assign(new MVPDocumentData(), obj));


      // ✅ Call MVP service
      this.mVPService.VerifyEmailAndCreateMvp(this.mVPProgramVM).subscribe({
        next: (user) => {
          if (user.body.success) {
            this.toastr.displaySuccessMessage('NMO', "MVP Project Created");

            this.router.navigate(['/customer-project-confirmation'], {
              queryParams: {
                caseid: user.body.projectId || user.body.caseId,
                fullName: (this._userInfo as any)?.firstNames || '',
                id: (this._userInfo as any)?.employeeId || user.body.userId || '',
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


  AllLookups() {

    this.authservice.AllLookups().subscribe(x => {
      if (x.ok == true) {
        this.countries = x.body.countries;
        this.projectAreas = x.body.projectAreas;
        this.projectPhases = x.body.projectPhases;
        this.supportNeeds = x.body.supportNeeds;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }

  formatSelectedNeeds(): void {
    const names = this.selectedNeeds.map(need => need.supportNeed); // Get an array of just the names

    if (names.length === 0) {
      this.formattedSelectedNeeds = 'No support needs selected.';
    } else if (names.length === 1) {
      this.formattedSelectedNeeds = names[0];
    } else if (names.length === 2) {
      this.formattedSelectedNeeds = `${names[0]} and ${names[1]}`;
    } else {
      // For 3 or more items, join all but the last with commas, then add "and" before the last
      const last = names.pop(); // Remove the last item
      this.formattedSelectedNeeds = `${names.join(', ')} and ${last}`;
    }
  }

  formatSelectedSkill(): void {
    const selectedSkill = this.Skills.filter(need => need.isChecked); // Get an array of just the names
    const names = selectedSkill.map(need => need.skillName); // Get an array of just the names

    if (names.length === 0) {
      this.formattedSelectedSkills = 'No support needs selected.';
    } else if (names.length === 1) {
      this.formattedSelectedSkills = names[0];
    } else if (names.length === 2) {
      this.formattedSelectedSkills = `${names[0]} and ${names[1]}`;
    } else {
      // For 3 or more items, join all but the last with commas, then add "and" before the last
      const last = names.pop(); // Remove the last item
      this.formattedSelectedSkills = `${names.join(', ')} and ${last}`;
    }

    console.log("Skills", this.formattedSelectedSkills)

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

        if (documentType == "Project Document") {
          this.IsProjectDocumentFile = true;
        }

        if (documentType == "Other Document") {
          this.IsOtherDocumentFile = true;
        }

        if (documentType == "UI Mockups Uploaded") {
          this.IsUIMockupsUploaded = true;
        }

        if (documentType == "API Specifications") {
          this.IsAPISpecifications = true;
        }

        if (documentType == "Design Assets") {
          this.IsDesignAssets = true;
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

    if (this.serviceId == 1) {
      // For service 1, documents are always required
      if (this.documentList == undefined || this.documentList == null || this.documentList.length <= 0) {
        this.toastr.displayErrorMessage("NMO", "Please Add Document");
        return;
      }
    }

    if (this.serviceId == 2) {
      // For MVP service, documents are only required if uiMockupsUploaded is true
      const uiMockupsUploaded = this.mvpProgramForm.get('uiMockupsUploaded')?.value;

      if (uiMockupsUploaded === true) {
        // Check if mockup file is uploaded when UI mockups is selected as "Yes"
        const hasMockupFile = this.documentList.some(doc => doc.DocumentType === "UI Mockups Uploaded");

        if (!hasMockupFile) {
          this.toastr.displayErrorMessage("NMO", "Please upload UI Mockup file since you selected 'Yes' for UI Mockups");
          return;
        }
      }
    }
    //this.documentList


    this.showLoader = true;

    if (this.isRegistrationOTPByPass == false) {
      this.emailVerifyModel.Otp = (this.emailOTP1 + this.emailOTP2 + this.emailOTP3 + this.emailOTP4 + this.emailOTP5 + this.emailOTP6).toString();
    }

    if (this.serviceId == 1) {

      this.emailVerifyModel.EmailAddress = this.registerUserVM.EmailAddress;

      this.projectRequestVM.emailverifyModel = this.emailVerifyModel;
      this.projectRequestVM.requestModel = this.projectRequest;
      this.projectRequestVM.userRegisterModel = this.registerUserVM;
      this.projectRequestVM.otherProgramAttend = this.otherProgramAttend;
      this.projectRequestVM.partner = this.partner;
      this.projectRequestVM.documentlist = this.documentList;


      this.authservice.CreateProject(this.projectRequestVM).subscribe({
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

    if (this.serviceId == 2) {

      this.mVPEmailVerifyModel.emailAddress = this.registerUserVM.EmailAddress;

      this.mVPProgramVM.emailverifyModel = this.mVPEmailVerifyModel;
      this.mVPProgramVM.requestModel = this.mvpProgram;
      this.mVPProgramVM.requestModel.desiredTechStack = this.formattedSelectedSkills;
      //this.mVPProgramVM.userRegisterModel = this.registerUserVM;
      this.mVPProgramVM.userRegisterModel = Object.assign(new MVPRegisterUserVM(), this.registerUserVM);
      this.mVPProgramVM.documentlist = this.documentList.map(obj => Object.assign(new MVPDocumentData(), obj));

      //this.mVPProgramVM.documentlist = Object.assign(new MVPDocumentData(),  this.documentList);


      this.mVPService.VerifyEmailAndCreateMvp(this.mVPProgramVM).subscribe({
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

    if (ProjectType == "Project Document") {
      this.IsProjectDocumentFile = false;
    }

    if (ProjectType == "Other Document") {
      this.IsOtherDocumentFile = false;
    }

    // Second Service

    if (ProjectType == "UI Mockups Uploaded") {
      this.IsUIMockupsUploaded = false;
    }

    if (ProjectType == "API Specifications") {
      this.IsAPISpecifications = false;
    }

    if (ProjectType == "Design Assets") {
      this.IsDesignAssets = false;
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