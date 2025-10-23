import { Component } from '@angular/core';
import { ForeignEntrepreneurService } from '../../../shared/services/twsbservices/ForeignEntrepreneur.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TwsbpagesmoduleModule } from '../../../components/twsbpages/twsbpagesmodule.module';
import { parseJSON } from 'date-fns';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';


@Component({
  selector: 'app-foreigner-entrepreneur-project',
  templateUrl: './foreigner-entrepreneur-project.component.html',
  styleUrls: ['./foreigner-entrepreneur-project.component.scss'],
  standalone: true,
  providers: [DisplaymessageComponent],
  imports: [RouterModule, CommonModule, ReactiveFormsModule, TwsbpagesmoduleModule, SharedModule,NgbPopoverModule]
})
export class ForeignerEntrepreneurProjectComponent {
  feForm: FormGroup;
  step = 1;
  serviceId = 9;
  targetIndustries: any = [];
  // For dynamic file uploads per section
  fileUploads: { [key: string]: any } = {};

  // Dropdown and checkbox options
  stageOptions = [
    { value: 'Idea Stage', label: 'Idea Stage' },
    { value: 'Concept/Validation', label: 'Concept/Validation' },
    { value: 'MVP/Prototype', label: 'MVP/Prototype' },
    { value: 'Early Revenue', label: 'Early Revenue' },
    { value: 'Scaling', label: 'Scaling' },
    { value: 'Other', label: 'Other (Please specify)' }
  ];
  industryOptions = [
    'FinTech', 'HealthTech', 'EduTech', 'E-commerce', 'AI/ML', 'SaaS', 'CleanTech', 'Logistics', 'Tourism', 'Food & Beverage', 'Manufacturing', 'Other'
  ];
  serviceOptions = [
    { value: 'Entrepreneurship License Gateway', label: 'Entrepreneurship License Gateway' },
    { value: 'Market Navigator License Package', label: 'Market Navigator License Package' },
    { value: 'Compliance Catalyst License Package', label: 'Compliance Catalyst License Package' },
    { value: 'Venture Launchpad Accelerator', label: 'Venture Launchpad Accelerator' },
    { value: 'Innovation Builder License Package', label: 'Innovation Builder License Package' },
    { value: 'Customized Package', label: 'Customized Package' }
  ];
  timeframeOptions = [
    { value: 'Immediately', label: 'Immediately (within 1 month)' },
    { value: '1-3 months', label: '1-3 months' },
    { value: '3-6 months', label: '3-6 months' },
    { value: '6+ months', label: '6+ months' }
  ];
  fundingStageOptions = [
    'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Other'
  ];
  devStageOptions = [
    'Idea', 'Wireframes', 'Prototype', 'Beta', 'Live Product'
  ];
  companyStructureOptions = [
    'Limited Liability Company', 'Sole Proprietorship', 'Joint Stock Company', 'Branch Office', 'Other'
  ];
  budgetCurrencyOptions = ['SAR', 'USD'];

  // Services list for checkbox-based multi-select
  // serviceItems = [
  //   { id: '1', label: 'Entrepreneurship License Gateway' },
  //   { id: '2', label: 'Market Navigator License Package' },
  //   { id: '3', label: 'Compliance Catalyst License Package' },
  //   { id: '4', label: 'Venture Launchpad Accelerator' },
  //   { id: '5', label: 'Innovation Builder License Package' },
  //   { id: '99', label: 'Customized Package' }
  // ];
  showLoader: boolean = false;
  foreignPackagesList: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private foreignEntrepreneurService: ForeignEntrepreneurService,
    private toastr: DisplaymessageComponent,
  ) {
    this.serviceId = Number(this.route.snapshot.queryParamMap.get('serv')) || 9;
    this.feForm = this.fb.group({
      // Step 1: Contact & Basic Info
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[+0-9()\-\s]+$/)]],
      companyOrStartupName: [''],
      currentLocation: ['', Validators.required],
      businessDescription: ['', [Validators.required, Validators.maxLength(500)]],
      // Enums -> use numeric codes from backend
      currentStage: ['', Validators.required],
      otherStageDetails: [''],
      targetIndustries: [[], Validators.required],
      otherIndustryDetails: [''],
      // Services as multi-select of numeric ids
      services: [[], Validators.required],
      timeframe: ['', Validators.required],

      // Dynamic sections (all fields, shown/required based on service selection)
      // Entrepreneurship License Gateway
      onlyLicenseFacilitation: false,
      otherNeedsDescription: [''],

      // Market Navigator
      targetMarket: [''],
      keyAssumptions: [''],
      hasMarketResearch: [''],

      // Compliance Catalyst
      companyStructure: [''],
      hasIntellectualProperty: [''],
      legalConcerns: [''],

      // Venture Launchpad
      fundingStage: [''],
      targetFundraisingAmount: [''],
      estimatedValuation: [''],
      hasMVP: [''],
      mvpLink: [''],

      // Innovation Builder
      developmentStage: [''],
      hasSpecificationDoc: [''],
      seekingCoFounder: [''],
      rolesDescription: [''],
      hasCodeOrDesign: [''],
      codeOrDesignLinks: [''],

      // Customized Package
      detailedRequest: [''],
      primaryObjectives: [''],
      budgetAmount: [''],
      budgetCurrency: ['SAR'],

      // Consent
      agreeContact: "",
      agreeTerms:""
    });
  }

  ngOnInit()
  {
  this.GetAllForeignPackages();
  }

  // Step navigation
  nextStep() {
    // Define step-wise field validation
    let controlsToValidate: string[] = [];
    if (this.step === 1) {
      controlsToValidate = [
        'fullName', 'email', 'phoneNumber', 'currentLocation', 'businessDescription'
      ];
    } else if (this.step === 2) {
      controlsToValidate = [
        'currentStage', 'targetIndustries', 'timeframe'
      ];
    } else if (this.step === 3) {
      controlsToValidate = ['services'];
    }
    // Validate only current step's controls
    let invalid = false;
    controlsToValidate.forEach(ctrl => {
      const control = this.feForm.get(ctrl);
      if (control) {
        control.markAsTouched();
        if (control.invalid) invalid = true;
      }
    });
    if (invalid) return;
    this.step++;
  }
  prevStep() {
    if (this.step > 1) this.step--;
  }

  // Service selection helpers
  get selectedServices(): string[] {
    return (this.feForm.get('services')?.value || []).map((v: any) => v.toString());
  }

  isServiceSelected(id: string): boolean {
    const selected: any[] = this.feForm.get('services')?.value || [];
    return selected.map(v => v.toString()).includes(id);
  }

  toggleService(id: string, checked: boolean) {
    const ctrl = this.feForm.get('services');
    if (!ctrl) return;
    const current: any[] = (ctrl.value || []).map((v: any) => v.toString());
    let next: string[];
    if (checked) {
      next = Array.from(new Set([...current, id]));
    } else {
      next = current.filter(x => x !== id);
    }
    ctrl.setValue(next);
    ctrl.markAsTouched();
    ctrl.updateValueAndValidity();
  }

  // File upload per section
  onFileChange(event: any, section: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileUploads[section] = {
          base64Data: (reader.result as string).split(',')[1],
          documentType: file.name,
          extension: '.' + file.name.split('.').pop()
        };
      };
      reader.readAsDataURL(file);
    }
  }

  // Dynamic section visibility
  showSectionId(id: string): boolean {
    return this.selectedServices.includes(id);
  }

  // Consent step always visible at the end
  isConsentStep(): boolean {
    return this.step === 2 + this.selectedServices.length + 1;
  }


  
  GetAllForeignPackages() {
    this.foreignEntrepreneurService.GetAllForeignPackages().subscribe( {
     next:(x)=>{
       if (x.ok == true) {
        this.foreignPackagesList = x.body.data;
      }
      else {
        this.showLoader = false;
        //this.toastr.displayErrorMessage('NMO', x.body.message);
      }
    }, 
    error : (error) => {
      this.showLoader = false;
      //this.toastr.displayErrorMessage('NMO', error.message);
    },
    complete: () => {
      this.showLoader = false;
    }
    });
  }

  // Submission
  onSubmit() {
    // if (this.feForm.invalid) {
    //   this.feForm.markAllAsTouched();
    //   return;
    // }
    // Build payload
    const v = this.feForm.value;
    const servicesSelected = (v.services || []).map((x: any) => Number(x));
    this.targetIndustries.push(v.targetIndustries); //const targetIndustries = (v.targetIndustries || []).map((x: any) => Number(x));
    const docs = Object.values(this.fileUploads).map((d: any) => ({
      Base64Data: d.base64Data,
      Extension: d.extension,
      DocumentType: d.documentType
    }));

    const payload: any = {
      EmployeeId: 0,
      ServiceId: this.serviceId,
      FullName: v.fullName,
      Email: v.email,
      PhoneNumber: v.phoneNumber,
      CompanyOrStartupName: v.companyOrStartupName,
      CurrentLocation: v.currentLocation,
      BusinessDescription: v.businessDescription,
      CurrentStage: Number(v.currentStage),
      OtherStageDetails: v.otherStageDetails,
      TargetIndustries: this.targetIndustries,
      OtherIndustryDetails: v.otherIndustryDetails,
      Timeframe: Number(v.timeframe),
      Services: servicesSelected,
      documentlist: docs,
      EntrepreneurshipLicense: this.showSectionId('1') ? {
        OnlyLicenseFacilitation: JSON.parse(v.onlyLicenseFacilitation),
        OtherNeedsDescription: v.otherNeedsDescription
      } : undefined,
      MarketNavigator: this.showSectionId('2') ? {
        TargetMarket: v.targetMarket,
        KeyAssumptions: v.keyAssumptions,
        HasMarketResearch: v.hasMarketResearch
      } : undefined,
      ComplianceCatalyst: this.showSectionId('3') ? {
        CompanyStructure: v.companyStructure,
        HasIntellectualProperty: v.hasIntellectualProperty,
        LegalConcerns: v.legalConcerns
      } : undefined,
      VentureLaunchpad: this.showSectionId('4') ? {
        FundingStage: v.fundingStage,
        TargetFundraisingAmount: v.targetFundraisingAmount,
        EstimatedValuation: v.estimatedValuation,
        HasMVP: v.hasMVP,
        MVPLink: v.mvpLink
      } : undefined,
      InnovationBuilder: this.showSectionId('5') ? {
        DevelopmentStage: v.developmentStage,
        HasSpecificationDoc: v.hasSpecificationDoc,
        SeekingCoFounder: v.seekingCoFounder,
        RolesDescription: v.rolesDescription,
        HasCodeOrDesign: v.hasCodeOrDesign,
        CodeOrDesignLinks: v.codeOrDesignLinks
      } : undefined,
      CustomizedPackage: this.showSectionId('99') ? {
        DetailedRequest: v.detailedRequest,
        PrimaryObjectives: v.primaryObjectives,
        BudgetAmount: v.budgetAmount,
        BudgetCurrency: v.budgetCurrency
      } : undefined
    };

    this.showLoader = true;
    this.foreignEntrepreneurService.CreateForeignEntrepreneurRequest(payload).subscribe({
      next: (res) => {
        if (res.body && res.body.success) {
          this.showLoader = false;
          this.toastr.displaySuccessMessage('NMO', "Request submitted successfully!");
          this.router.navigate(['/home']);
        } else {
          this.showLoader = false;
          //alert('Submission failed. Please try again.');
          this.toastr.displayErrorMessage('NMO', "Submission failed. Please try again.");
        }
      },
      error: (err) => {
        this.showLoader = false;
        //alert('An error occurred while submitting the request.');
        this.toastr.displayErrorMessage('NMO', "An error occurred while submitting the request.");
        console.error(err);
      }
    });
  }
}
