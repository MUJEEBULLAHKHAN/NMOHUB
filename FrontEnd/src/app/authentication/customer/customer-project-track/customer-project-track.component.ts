
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbAccordionConfig, NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { NMOService } from '../../../shared/services/new.service';
import { ProjectRequestResponse } from '../../../models/request.service';
import {
  ApproveProjectRequestModel, RejectProjectRequestModel, PitchCompleteRequestModel,
  ScheduleMeetingModel, DocumentData, ReviewPitchAndScoreModel, SendProposalModel, RejectIdeaModel,
  AcceptProposalModel, RejectProposalModel, PaymentReceivedModel, UploadPaymentProofdocModel, 
} from '../../../models/new-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TwsbpagesmoduleModule } from '../../../../app/components/twsbpages/twsbpagesmodule.module';
import { ServiceOverviewComponent} from '../../../components/twsbpages/service/service-overview/service-overview.component'
import { MVPServiceOverviewComponent} from '../../../components/twsbpages/service/mvp-service-overview/mvp-service-overview.component'
import { FeasibilityServiceOverviewComponent} from '../../../components/twsbpages/service/feasibility-service-overview/feasibility-service-overview.component'
import { PreacServiceOverviewComponent} from '../../../components/twsbpages/service/preac-service-overview/preac-service-overview.component'

@Component({
  selector: 'app-customer-project-track',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule,
    //TwsbpagesmoduleModule,
     CommonModule,
    TwsbpagesmoduleModule, // ✅ Import the module that exports ServiceNotesComponent
    ReactiveFormsModule,
    NgbModule,
   // ServiceOverviewComponent
],
  providers: [DisplaymessageComponent],
    templateUrl: './customer-project-track.component.html',
  styleUrl: './customer-project-track.component.scss'
})
export class CustomerProjectTrackComponent implements OnInit, AfterViewInit {

  serviceId!: any
  projectId!: any;
  
  constructor(config: NgbAccordionConfig,
    private jobService: NMOService,
    private route: ActivatedRoute,
    private toaster: DisplaymessageComponent,
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,) {
    config.closeOthers = true;
    
    
    const idParam = this.route.snapshot.queryParamMap.get('id');
    this.serviceId = this.route.snapshot.queryParamMap.get('serv');
    this.projectId = Number(idParam);

  }

  ngOnInit(): void {
    
    
    

  }



  ngAfterViewInit() {
    this.hideNavContentBorder('0');

  }


  navTabChange(panelId: any) {
    this.hideNavContentBorder(panelId);
  }

  openRight(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }


  hideNavContentBorder(panelId: any) {

    const _div = "ngb-nav-" + panelId + "-panel";
    const _element = document.getElementById(_div);
    if (_element) {
      _element.setAttribute('style', 'border:none;');
    }
  }
  
}


