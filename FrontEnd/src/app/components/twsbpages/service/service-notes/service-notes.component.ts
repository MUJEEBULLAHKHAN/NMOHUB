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

@Component({
  selector: 'app-service-notes',
  standalone: false,
 // imports: [],
  templateUrl: './service-notes.component.html',
  styleUrl: './service-notes.component.scss'
})




export class ServiceNotesComponent implements OnChanges {

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
   showLoader:boolean=false;
  // showSaveChangesBtn:boolean=false;
  // courtesyCarLog = new CourtesyCarLog();
  // @Input('serviceRequestDetails') serviceRequestDetails: any;

  notesList: any;

  constructor(config: NgbAccordionConfig,
    private jobService:NMOService,
    private route:ActivatedRoute,
    private toaster:DisplaymessageComponent,
    private referenceService: ReferenceService,
    private workshopCourtesyCarsService: WorkshopCourtesyCarsService,
  private modalService: NgbModal)
  {
    //config.closeOthers = true;
    document.querySelector('.single-page-header')?.classList.add('d-none');
    
  }

  ngOnInit() {
    this.GetNotesByProject();
  }

  ngAfterViewInit()
  {
    
  }

  ngOnChanges(changes: SimpleChanges) {
   
  }


    GetNotesByProject() {
    const idParam= this.route.snapshot.queryParamMap.get('id');
    const serviceId= this.route.snapshot.queryParamMap.get('serv');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO','No Service Request ID found');
      return;
    }

     this.showLoader = true;
    this.jobService.GetNotesByProject(id, serviceId).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.notesList = user.body.data;
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

    // this.jobService.GetProjectActivitiesByProject(id).subscribe({
    //   next: (data) => {
    //     this.timeLineList = data.body.data;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching service request details:', error);
    //     this.toaster.displayErrorMessage('NMO', error.error.message);
    //   }
    // });
  }

}
