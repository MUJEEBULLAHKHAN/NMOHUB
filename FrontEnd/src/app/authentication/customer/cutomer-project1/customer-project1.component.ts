import { Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../../shared/models/authentication';
import { UserAuthService } from '../../../shared/services/twsbservices/user-auth.service';
import { NMOService } from '../../../shared/services/new.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { Service, Package } from '../../../models/Reference';
import { PackageService } from '../../../shared/services/twsbservices/package.service';
import {
  ProjectRequestVM, ProjectRequest, RegisterUserVM, EmailVerifyModel, SupportNeeds, Partner, OtherProgramAttend,
  DocumentData
} from '../../../models/new-service';

@Component({
  selector: 'app-customer-project1',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './customer-project1.component.html',
  styleUrl: './customer-project1.component.scss'
})
export class CustomerProject1Component implements OnInit, OnDestroy {
  selectedFile: File | null = null;

  step: number = 1;
  lastStep: number = 5;
  _userInfo = null;
  isEmailVerificationStepComplete: boolean = false;

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
  showLoader: boolean | undefined;
  role!: string;
  roleId!: number;
  public _userDetails: any
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
    this.AllLookups();
  }
  // GetAllCountry() {
  //   throw new Error('Method not implemented.');
  // }

  GoToNext() {
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
          this.toastr.displaySuccessMessage('TWSB', "Project Created");

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

  onFileSelected(event: any, documentType: any) {

    let fileList: FileList = event.target.files;
    if (fileList.length < 1) {
      return;
    }

    let file: File = fileList[0];
     if (file) {
      this.selectedFile = file;
    }

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

        let document = new DocumentData();
        document.DocumentType = documentType;
        document.Extension =  this.getFileExtension(file.name);
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

  }


}