import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbAccordionConfig, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { JobService } from '../../../../shared/services/twsbservices/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { StatusupdatesService } from '../../../../shared/services/twsbservices/statusupdates.service';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { assignedTicketUsers, StatusUpdates } from '../../../../models/PostModels/StatusUpdateModel';
import { AudatexTokenModel } from '../../../../models/AudatexTokenModel';
import { AudatexService } from '../../../../shared/services/twsbservices/audatex.service';
import { WorkshopNotificationService } from '../../../../shared/services/twsbservices/workshop-notification.service';
import { SearchService } from '../../../../shared/services/twsbservices/search.service';
//import { NMOService } from '../../../../shared/services/new.service';
//import { ProjectRequestResponse } from '../../../../models/request.service';
import { PreacService } from '../../../../shared/services/twsbservices/preac.service';

import {
  ApproveProjectRequestModel, RejectProjectRequestModel,
  ScheduleMeetingModel, PitchCompleteRequestModel, ReviewPitchAndScoreModel, DocumentData,
  RejectIdeaModel, SendProposalModel, AcceptProposalModel,
  PaymentReceivedModel, RejectProposalModel, UploadPaymentProofdocModel,
  ProgramActiveRequestModel
} from '../../../../models/new-service';

import { ProjectRequestResponse } from '../../../../models/feasibility-study.models'
import { NMOService } from '../../../../shared/services/new.service';

import { tr } from 'date-fns/locale';

@Component({
  selector: 'app-preac-service-overview',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './preac-service-overview.component.html',
  styleUrl: './preac-service-overview.component.scss'
})
export class PreacServiceOverviewComponent implements OnInit {

  projectId!: number;
  serviceRequestDetails = new ProjectRequestResponse();
  statusList: any;
  previousStatus: any;
  nextStatus: any;
  //serviceRequestDetails: any;
  showLoader: boolean = false;
  // notes: string = "";
  _userInfo: any;
  role!: string;
  roleId!: number;
  approveshowLoader: boolean = false;
  approveProjectRequestModel = new ApproveProjectRequestModel();
  rejectProjectRequestModel = new RejectProjectRequestModel();
  scheduleMeetingModel = new ScheduleMeetingModel();
  pitchCompleteRequestModel = new PitchCompleteRequestModel();
  documentList: DocumentData[] = [];
  reviewPitchAndScoreModel = new ReviewPitchAndScoreModel();
  pitchScoreValue!: number;
  sendProposalModel = new SendProposalModel();
  rejectIdeaModel = new RejectIdeaModel();
  acceptProposalModel = new AcceptProposalModel();
  rejectProposalModel = new RejectProposalModel();
  paymentReceivedModel = new PaymentReceivedModel();
  uploadPaymentProofdocModel = new UploadPaymentProofdocModel();
  programActiveRequestModel = new ProgramActiveRequestModel();
  // //projectRequestResponseVM = new ProjectRequestResponseVM();
  platFormOptions: any = ["Google Meet", "Zoom", "Teams"]
  timeSlotsByDate: any;
  availableSlot: any;
  currentUrl = window.location.pathname; // Getting the full URL
  employeeId: any;

  @ViewChild('modalApproveMethodPopUp') modalApproveMethodPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalRejectMethodPopUp') modalRejectMethodPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalScheduleMeetingPopUp') modalScheduleMeetingPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalPitchCompletePopUp') modalPitchCompletePopUp: TemplateRef<any> | undefined;
  @ViewChild('modalReviewPitchPopUp') modalReviewPitchPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalSendProposalPopUp') modalSendProposalPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalRejectIdeaModelPopUp') modalRejectIdeaModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalRejectProposalModelPopUp') modalRejectProposalModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalUploadPaymentProofModelPopUp') modalUploadPaymentProofModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalProgramActiveModelPopUp') modalProgramActiveModelPopUp: TemplateRef<any> | undefined;


  constructor(config: NgbAccordionConfig,
    //private jobService: NMOService,
    private route: ActivatedRoute,
    private toaster: DisplaymessageComponent,
    // private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private preacService: PreacService,
    private jobService: NMOService,
  ) {
    config.closeOthers = true;
    document.querySelector('.single-page-header')?.classList.add('d-none');
    console.log("USER INFO IS ", this._userInfo);
  }

  ngOnInit(): void {
    document.getElementById('ngb-nav-0-panel')?.setAttribute('style', 'border:none;');
    this.GetPreAcceleratorRequestDetails();
    this.AvailableSlots();
    //automatically close side menu bar to gain more space for job tables

    if (this.currentUrl !== "/customer-project-track") {
      this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
      this.employeeId = this._userInfo.employeeId;

      var roles = JSON.parse(localStorage.getItem('roles') ?? '');
      console.log("Role INFO IS ", roles);
      this.role = roles[0].name;
      this.roleId = roles[0].id;

    } else {
      this.employeeId = 0;
      this.roleId = 1;
    }
    const idParam = this.route.snapshot.queryParamMap.get('id');
    this.projectId = Number(idParam);

  }



  // ngAfterViewInit() {
  //   this.hideNavContentBorder('0');

  // }


  navTabChange(panelId: any) {
    this.hideNavContentBorder(panelId);
  }

  // openRight(content: TemplateRef<any>) {
  //   //this.offcanvasService.open(content, { position: 'end' });
  // }


  hideNavContentBorder(panelId: any) {

    const _div = "ngb-nav-" + panelId + "-panel";
    const _element = document.getElementById(_div);
    if (_element) {
      _element.setAttribute('style', 'border:none;');
    }
  }

  GetSlotsByDate(slots: any) {
    this.timeSlotsByDate = slots
  }

  SelectSlot(timeSlot: any) {

  }

  AvailableSlots() {

    this.approveshowLoader = true;
    this.jobService.GetAllAvailableSlot().subscribe({
      next: (user) => {
        if (user.body.success) {
          this.availableSlot = user.body.data
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
          this.approveshowLoader = false;
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', error.error.message);
        this.approveshowLoader = false;
      },
      complete: () => {
        this.approveshowLoader = false;
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
        this.serviceRequestDetails = data.body.data;
        this.GetProjectStatus();

        console.log('Service Request Details:', this.serviceRequestDetails);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }


  ApproveMethodPopUp() {
    this.approveProjectRequestModel = new ApproveProjectRequestModel();
    this.modalService.open(this.modalApproveMethodPopUp, { backdrop: 'static' });
  }

  Approve() {

    if (this.approveProjectRequestModel.FollowUpStart == undefined || this.approveProjectRequestModel.FollowUpStart == null || this.approveProjectRequestModel.FollowUpStart == '') {
      this.toaster.displayErrorMessage('NMO', "Please Select FollowUp Start Date");
      return;
    }

    if (this.approveProjectRequestModel.FollowUpEnd == undefined || this.approveProjectRequestModel.FollowUpEnd == null || this.approveProjectRequestModel.FollowUpEnd == '') {
      this.toaster.displayErrorMessage('NMO', "Please Select FollowUp End Date");
      return;
    }

    if (this.approveProjectRequestModel.Comments == undefined || this.approveProjectRequestModel.Comments == null || this.approveProjectRequestModel.Comments == '') {
      this.toaster.displayErrorMessage('NMO', "Please Enter Comments");
      return;
    }

    this.approveProjectRequestModel.EmployeeId = this._userInfo.employeeId
    this.approveProjectRequestModel.ProjectId = this.projectId;

    this.approveshowLoader = true;
    this.preacService.ApprovePreAcceleratorRequest(this.approveProjectRequestModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
          this.approveshowLoader = false;
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', error.error.message);
        this.approveshowLoader = false;
      },
      complete: () => {
        this.approveshowLoader = false;
      }
    });

  }

  RejectMethodPopUp() {
    this.rejectProjectRequestModel = new RejectProjectRequestModel();
    this.modalService.open(this.modalRejectMethodPopUp, { backdrop: 'static' });
  }

  Reject() {

    if (this.rejectProjectRequestModel.Comments == null || this.rejectProjectRequestModel.Comments == "" ||
      this.rejectProjectRequestModel.Comments == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Comments");
      return;
    }


    this.rejectProjectRequestModel.EmployeeId = this._userInfo.employeeId
    this.rejectProjectRequestModel.ProjectId = this.projectId;

    this.showLoader = true;
    this.preacService.RejectPreAcceleratorRequest(this.rejectProjectRequestModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
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


  ScheduleMeetingMethodPopUp() {
    this.scheduleMeetingModel = new ScheduleMeetingModel();
    this.modalService.open(this.modalScheduleMeetingPopUp, { backdrop: 'static' });
  }

  ScheduleMeeting() {

    // if(this.scheduleMeetingModel.Platform == null || this.scheduleMeetingModel.Platform == "" ||
    //   this.scheduleMeetingModel.Platform == undefined
    // ) {
    //  this.toaster.displayErrorMessage('NMO', "Please Enter PlatForm");
    //  return; 
    // }

    if (this.scheduleMeetingModel.IsVirtual == null || this.scheduleMeetingModel.IsVirtual == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Select Meeting Option, Is Virtual Or Not");
      return;
    }

    if (this.scheduleMeetingModel.IsVirtual) {

      if (this.scheduleMeetingModel.Url == null || this.scheduleMeetingModel.Url == "" || this.scheduleMeetingModel.Url == undefined
      ) {
        this.toaster.displayErrorMessage('NMO', "Please Enter URL");
        return;
      }

      if (this.scheduleMeetingModel.Platform == null || this.scheduleMeetingModel.Platform == "" ||
        this.scheduleMeetingModel.Platform == undefined
      ) {
        this.toaster.displayErrorMessage('NMO', "Please Enter PlatForm");
        return;
      }

    }


    if (this.scheduleMeetingModel.ScheduleDate == null || this.scheduleMeetingModel.ScheduleDate == undefined || this.scheduleMeetingModel.ScheduleDate == ""
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Schedule Date");
      return;
    }

    if (this.scheduleMeetingModel.ScheduleTime == null || this.scheduleMeetingModel.ScheduleTime == undefined || this.scheduleMeetingModel.ScheduleTime == ""
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Schedule Time");
      return;
    }

    const timeParts = this.scheduleMeetingModel.ScheduleTime.split(':');
    const hours = Number(timeParts[0]);
    const minutes = Number(timeParts[1]);
    const seconds = Number("00");
    const timeSpan = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    this.scheduleMeetingModel.ScheduleTime = timeSpan;



    if (this.employeeId == 0) {
      this.employeeId = this.serviceRequestDetails.requestModel.employeeId
      this.scheduleMeetingModel.EmployeeId = this.employeeId
    }

    this.scheduleMeetingModel.EmployeeId = this._userInfo.employeeId
    this.scheduleMeetingModel.ProjectID = this.projectId;

    this.showLoader = true;
    this.preacService.ScheduleMeeting(this.scheduleMeetingModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
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



  PitchCompleteMethodPopUp() {
    this.pitchCompleteRequestModel = new PitchCompleteRequestModel();
    this.modalService.open(this.modalPitchCompletePopUp, { backdrop: 'static' });
  }

  PitchComplete() {

    if (this.pitchCompleteRequestModel.Feedback == null || this.pitchCompleteRequestModel.Feedback == "" ||
      this.pitchCompleteRequestModel.Feedback == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Feedback");
      return;
    }

    if (this.documentList == null || this.documentList.length <= 0 ||
      this.documentList == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Add At Least One Document ");
      return;
    }


    this.pitchCompleteRequestModel.EmployeeId = this._userInfo.employeeId
    this.pitchCompleteRequestModel.ProjectId = this.projectId;
    this.pitchCompleteRequestModel.Documents = this.documentList;


    this.showLoader = true;
    this.preacService.PitchComplete(this.pitchCompleteRequestModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
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


  ReviewPitchMethodPopUp() {
    this.reviewPitchAndScoreModel = new ReviewPitchAndScoreModel();
    this.pitchScoreValue = 0;
    this.modalService.open(this.modalReviewPitchPopUp, { backdrop: 'static' });
  }

  ReviewPitch() {

    if (this.reviewPitchAndScoreModel.Review == null || this.reviewPitchAndScoreModel.Review == "" ||
      this.reviewPitchAndScoreModel.Review == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Review");
      return;
    }

    if (this.pitchScoreValue == null || this.pitchScoreValue == undefined || this.pitchScoreValue <= 0
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Select Score");
      return;
    }

    this.reviewPitchAndScoreModel.ScoreValue = this.pitchScoreValue;
    this.reviewPitchAndScoreModel.EmployeeId = this._userInfo.employeeId;
    this.reviewPitchAndScoreModel.ProjectId = this.projectId;


    this.showLoader = true;
    this.preacService.ReviewPitchAndScore(this.reviewPitchAndScoreModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
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



  SendProposalMethodPopUp() {
    this.sendProposalModel = new SendProposalModel();
    this.documentList = []
    this.modalService.open(this.modalSendProposalPopUp, { backdrop: 'static' });
  }

  SendProposal() {

    if (this.sendProposalModel.Comments == null || this.sendProposalModel.Comments == "" ||
      this.sendProposalModel.Comments == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Comments");
      return;
    }

    if (this.documentList == null || this.documentList.length <= 0 ||
      this.documentList == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Add At Least One Document ");
      return;
    }


    this.sendProposalModel.EmployeeId = this._userInfo.employeeId
    this.sendProposalModel.ProjectId = this.projectId;
    this.sendProposalModel.Documents = this.documentList;


    this.showLoader = true;
    this.preacService.SendProposal(this.sendProposalModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
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


  RejectIdeaMethodPopUp() {
    this.rejectIdeaModel = new RejectIdeaModel();
    this.modalService.open(this.modalRejectIdeaModelPopUp, { backdrop: 'static' });
  }

  RejectIdea() {

    if (this.rejectIdeaModel.Comments == null || this.rejectIdeaModel.Comments == "" ||
      this.rejectIdeaModel.Comments == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Comments");
      return;
    }


    this.rejectIdeaModel.EmployeeId = this._userInfo.employeeId
    this.rejectIdeaModel.ProjectId = this.projectId;

    this.showLoader = true;
    this.preacService.RejectIdea(this.rejectIdeaModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
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



  AcceptProposal() {


    this.acceptProposalModel.EmployeeId = this._userInfo.employeeId
    this.acceptProposalModel.ProjectId = this.projectId;

    this.showLoader = true;
    this.preacService.AcceptProposal(this.acceptProposalModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.GetPreAcceleratorRequestDetails();
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


  RejectProposalPopUp() {
    this.rejectProposalModel = new RejectProposalModel();
    this.modalService.open(this.modalRejectProposalModelPopUp, { backdrop: 'static' });
  }

  RejectProposal() {

    if (this.rejectProposalModel.Comments == null || this.rejectProposalModel.Comments == "" ||
      this.rejectProposalModel.Comments == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Comments");
      return;
    }


    this.rejectProposalModel.EmployeeId = this._userInfo.employeeId
    this.rejectProposalModel.ProjectId = this.projectId;

    this.showLoader = true;
    this.preacService.RejectProposal(this.rejectProposalModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
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

  selectRangeQuestionAnswer(range: number) {
    this.pitchScoreValue = range
  }

  onFileSelected(event: any) {

    let fileList: FileList = event.target.files;
    if (fileList.length < 1) {
      return;
    }

    let file: File = fileList[0];

    if (file == null || file == undefined) {
      this.toaster.displayErrorMessage('NMO', "Please Select A File");
      return;
    }

    if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "application/pdf") {

      //2MB = 2097152
      if (file.size > 2099000) {
        this.toaster.displayErrorMessage('NMO', "Please Select Max 2 MB File");
        return;
      }


      if (file != null) {

        let document = new DocumentData();
        document.DocumentType = "Pitch Complete";
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
      this.toaster.displayErrorMessage('NMO', "Please Select JPEG OR PDF OR PDF");
      return;
    }
  }

  onFileSelectedCommon(event: any, documentType: any) {

    let fileList: FileList = event.target.files;
    if (fileList.length < 1) {
      return;
    }

    let file: File = fileList[0];

    if (file == null || file == undefined) {
      this.toaster.displayErrorMessage('NMO', "Please Select A File");
      return;
    }

    if (file.type == "image/jpeg" || file.type == "image/png" || file.type == "application/pdf") {

      //2MB = 2097152
      if (file.size > 2099000) {
        this.toaster.displayErrorMessage('NMO', "Please Select Max 2 MB File");
        return;
      }


      if (file != null) {

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
      this.toaster.displayErrorMessage('NMO', "Please Select JPEG OR PDF OR PDF");
      return;
    }
  }

  PaymentReceived() {
    this.paymentReceivedModel.EmployeeId = this._userInfo.employeeId
    this.paymentReceivedModel.ProjectId = this.projectId;

    this.showLoader = true;
    this.preacService.PaymentReceived(this.paymentReceivedModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.GetPreAcceleratorRequestDetails();
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



  UploadPaymentProofPopUp() {
    this.documentList = [];
    this.uploadPaymentProofdocModel = new UploadPaymentProofdocModel();
    this.modalService.open(this.modalUploadPaymentProofModelPopUp, { backdrop: 'static' });
  }

  UploadPaymentProof() {

    if (this.uploadPaymentProofdocModel.Comments == null || this.uploadPaymentProofdocModel.Comments == "" ||
      this.uploadPaymentProofdocModel.Comments == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Comments");
      return;
    }

    if (this.documentList == null || this.documentList.length <= 0 ||
      this.documentList == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Upload Payment Receipt");
      return;
    }


    this.uploadPaymentProofdocModel.Documents = this.documentList;
    this.uploadPaymentProofdocModel.EmployeeId = this._userInfo.employeeId
    this.uploadPaymentProofdocModel.ProjectId = this.projectId;

    this.showLoader = true;
    this.preacService.UploadPaymentProofdoc(this.uploadPaymentProofdocModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
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


  ProgramActiveModelPopUp() {
    this.programActiveRequestModel = new ProgramActiveRequestModel();
    this.modalService.open(this.modalProgramActiveModelPopUp, { backdrop: 'static' });
  }

  ProgramActive() {

    if (this.programActiveRequestModel.ProjectStart == null || this.programActiveRequestModel.ProjectStart == "" ||
      this.programActiveRequestModel.ProjectStart == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Project Start");
      return;
    }

    if (this.programActiveRequestModel.ProjectEnd == null || this.programActiveRequestModel.ProjectEnd == "" ||
      this.programActiveRequestModel.ProjectEnd == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Project End");
      return;
    }

    if (this.programActiveRequestModel.Comments == null || this.programActiveRequestModel.Comments == "" ||
      this.programActiveRequestModel.Comments == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Comment");
      return;
    }

    this.programActiveRequestModel.EmployeeId = this._userInfo.employeeId
    this.programActiveRequestModel.ProjectId = this.projectId;

    this.approveshowLoader = true;
    this.preacService.ProgramActiveRequest(this.programActiveRequestModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.GetPreAcceleratorRequestDetails();
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
          this.approveshowLoader = false;
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', error.error.message);
        this.approveshowLoader = false;
      },
      complete: () => {
        this.approveshowLoader = false;
      }
    });

  }

  GetProjectStatus() {
    this.preacService.GetProjectStatus().subscribe({
      next: (data) => {
        this.statusList = data.body;
        const { prev, next } = this.getPrevNextStatusIds(this.statusList, this.serviceRequestDetails.projectStatus.statusId);
        this.previousStatus = prev;
        this.nextStatus = next;
        console.log('status', this.statusList);
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }

  getPrevNextStatusIds(list: any[], statusId: number): { prev: number | null, next: number | null } {
    const index = list.findIndex(s => s.statusId === statusId);
    return {
      prev: index > 0 ? list[index - 1].statusName : null,
      next: (index !== -1 && index < list.length - 1) ? list[index + 1].statusName : null
    };
  }

  SelectScheduleTime(timeSlot: any) {
    this.scheduleMeetingModel.SlotId = timeSlot.meetingSlotId;
  }

  RemoveFile(index: any) {
    this.documentList.splice(index, 1);
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  cleanBase64Data(data: any): string {
    return data.replace(/^data:[^;]+;base64,/, '');
  }

  getFileExtension(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase(); // Get the part after the last dot and convert to lowercase
    return ("." + extension) || ''; // Return the extension or an empty string if no extension is found
  }
}


