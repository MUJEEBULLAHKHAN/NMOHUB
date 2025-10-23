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
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-service-timeline',
  standalone: false,
  // imports: [],
  templateUrl: './service-timeline.component.html',
  styleUrl: './service-timeline.component.scss'
})




export class ServiceTimelineComponent implements OnChanges {

  // jobDetails:any;
  // editVehicleDetails:boolean=false;
  // editContactDetails:boolean=false;
  // vehicleMakes:any[]=[];
  // vehicleModels:any[]=[];
  // vehicleColors:any[]=[];
  // userRole:any;
  // jobTypes:any[]=[];
  // estimators:any[]=[];
  // serviceAdvisors:any[]=[];
  // insurers:any[]=[];
  // jobDetailsCached:any;
  showLoader: boolean = false;
  // showSaveChangesBtn:boolean=false;
  // courtesyCarLog = new CourtesyCarLog();
  // @Input('serviceRequestDetails') serviceRequestDetails: any;

  timeLineList: any;
  ascTimeLine: any;
  statusList: any;
  currentStatusId: any;
  serviceId: any;

  constructor(config: NgbAccordionConfig,
    private jobService: NMOService,
    private route: ActivatedRoute,
    private toaster: DisplaymessageComponent,
    private referenceService: ReferenceService,
    private workshopCourtesyCarsService: WorkshopCourtesyCarsService,
    private modalService: NgbModal) {
    //config.closeOthers = true;
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.serviceId = this.route.snapshot.queryParamMap.get('serv');
  }

  ngOnInit() {
    this.GetProjectActivitiesByProject();
    this.GetProjectStatus();
  }

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }


  GetProjectActivitiesByProject() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }

    this.showLoader = true;
    this.jobService.GetProjectActivitiesByProject(id, this.serviceId).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.timeLineList = user.body.data;
          this.currentStatusId = user.body.currentStatusId;
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
          this.showLoader = false;
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', error.error.message);
        this.showLoader = false;
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  GetProjectStatus() {
    this.jobService.GetProjectStatus().subscribe({
      next: (data) => {
        this.statusList = data.body;
        console.log('status', this.statusList);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }


}
