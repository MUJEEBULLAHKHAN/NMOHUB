import { Component, Input, input, TemplateRef, viewChild, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../../../shared/services/twsbservices/job.service';
import { ActivatedRoute } from '@angular/router';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { WorkshopCourtesyCarsService } from '../../../../shared/services/twsbservices/workshop-courtesy-cars.service';
import { CourtesyCarLog } from '../../../../models/WorkShopCourtesyCars';
import { NMOService } from '../../../../shared/services/new.service';
import { RequestList } from '../../../../models/new-service';
import { MVPService } from '../../../../shared/services/twsbservices/mvp.service';
import { FeasService } from '../../../../shared/services/twsbservices/feas.service';
import { PreacService } from '../../../../shared/services/twsbservices/preac.service';
import { ProjectRequestResponse } from '../../../../models/feasibility-study.models'
import { PreAcceleratorVM } from '../../../../models/preac.models'
import { ForeignEntrepreneurService } from '../../../../shared/services/twsbservices/ForeignEntrepreneur.service';
import { ForeignEntrepreneur } from '../../../../models/foreignentrepreneur.model';

@Component({
  selector: 'app-service-main',
  standalone: false,
  // imports: [],
  templateUrl: './service-main.component.html',
  styleUrl: './service-main.component.scss'
})




export class ServiceMainComponent implements OnChanges {

  // jobDetails: any;
  // editVehicleDetails: boolean = false;
  // editContactDetails: boolean = false;
  // vehicleMakes: any[] = [];
  // vehicleModels: any[] = [];
  // vehicleColors: any[] = [];
  // userRole: any;
  // jobTypes: any[] = [];
  // estimators: any[] = [];
  // serviceAdvisors: any[] = [];
  // insurers: any[] = [];
  // jobDetailsCached: any;
  // showLoader: boolean = false;
  // showSaveChangesBtn: boolean = false;
  // courtesyCarLog = new CourtesyCarLog();
  serviceId: any;
  serviceRequestDetails: any;
  feasibilityRequestDetails = new ProjectRequestResponse();
  preAcceleratorVM = new PreAcceleratorVM();
  userRegisterModel: any = {}; //new RegisterUserVM();
  requestModel: any = {}; //new RegisterUserVM();
  projectPhase: any = {}; //new RegisterUserVM();
  projectArea: any = {}; //new RegisterUserVM();

  //@Input('serviceRequestDetails') serviceRequestDetails: any;
  constructor(config: NgbAccordionConfig,
    private jobService: NMOService,
    private route: ActivatedRoute,
    private toaster: DisplaymessageComponent,
    private referenceService: ReferenceService,
    private workshopCourtesyCarsService: WorkshopCourtesyCarsService,
    private mVPService: MVPService,
    private preacService: PreacService,
    private feasService: FeasService,
    public foreignEntrepreneurService: ForeignEntrepreneurService,
    private modalService: NgbModal) {
    //config.closeOthers = true;
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.serviceId = this.route.snapshot.queryParamMap.get('serv');
  }

  ngOnInit() {
    if (this.serviceId == 1) {
      this.GetProjectRequestDetailsbyProjectRequestid();
    }

    if (this.serviceId == 2) {
      this.GetMvpRequestDetails();
    }

    if (this.serviceId == 3) {
      this.GetFeasibilityRequestDetails();
    }

    if (this.serviceId == 4) {
      this.GetPreAcceleratorRequestDetails();
    }

     if (this.serviceId == 9) {
      this.GetForeignEntrepreneurRequestDetails();
    }

    // console.log("SERVICE REQUEST DETAILS ON SERVICE MAIN", this.serviceRequestDetails);
  }

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['serviceRequestDetails']) {
    //   console.log('SERVICE REQUEST DETAILS ON SERVICE MAIN', this.serviceRequestDetails);
    //   this.jobDetails = this.serviceRequestDetails;
    //   // You can add any logic here that depends on the input being set
    // }
  }


  GetProjectRequestDetailsbyProjectRequestid() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }
    this.jobService.GetProjectRequestDetailsbyProjectRequestid(id).subscribe({
      next: (data) => {
        this.serviceRequestDetails = data.body.data;
        this.userRegisterModel = this.serviceRequestDetails.userRegisterModel;
        this.requestModel = this.serviceRequestDetails.requestModel;
        this.projectPhase = this.serviceRequestDetails.projectPhase;
        this.projectArea = this.serviceRequestDetails.projectArea
        console.log('Service Request Details:', this.serviceRequestDetails);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }

  GetMvpRequestDetails() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }
    this.mVPService.GetMvpRequestDetails(id).subscribe({
      next: (data) => {
        this.serviceRequestDetails = data.body.data;
        this.userRegisterModel = this.serviceRequestDetails.userRegisterModel;
        this.requestModel = this.serviceRequestDetails.requestModel;
        console.log('Service Request Details:', this.serviceRequestDetails);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }

  GetPreAcceleratorRequestDetails() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }
    this.preacService.GetPreAcceleratorRequestDetails(id).subscribe({
      next: (data) => {
        this.preAcceleratorVM = data.body.data;
        this.userRegisterModel = this.preAcceleratorVM.userRegisterModel;
        this.requestModel = this.preAcceleratorVM.requestModel;
        console.log('Service Request Details:', this.preAcceleratorVM);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }

  GetFeasibilityRequestDetails() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }
    this.feasService.GetFeasibilityRequestDetails(id).subscribe({
      next: (data) => {
        this.feasibilityRequestDetails = data.body.data;
        this.userRegisterModel = this.feasibilityRequestDetails.userRegisterModel;
        this.requestModel = this.feasibilityRequestDetails.requestModel;
        console.log('Service Request Details:', this.feasibilityRequestDetails);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }

  GetForeignEntrepreneurRequestDetails() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }
    this.foreignEntrepreneurService.GetFERequestDetailsbyFeId(id).subscribe({
      next: (data) => {
        this.serviceRequestDetails = data.body.data;
        this.userRegisterModel = this.serviceRequestDetails.userRegisterModel;
        this.requestModel = this.serviceRequestDetails.requestModel;
        console.log('Service Request Details:', this.serviceRequestDetails);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
    console.warn('GetForeignEntrepreneurRequestDetails is not yet implemented.');
  }

}
