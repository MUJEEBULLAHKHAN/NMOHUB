
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { ForeignEntrepreneurDetailsVM } from '../../../../models/foreignentrepreneur.model';
import { ForeignEntrepreneurService } from '../../../../shared/services/twsbservices/ForeignEntrepreneur.service';
import { ApproveProjectRequestModel, RejectProjectRequestModel, ScheduleMeetingModel, PitchCompleteRequestModel, ReviewPitchAndScoreModel, DocumentData, RejectIdeaModel, SendProposalModel, AcceptProposalModel, PaymentReceivedModel, RejectProposalModel, UploadPaymentProofdocModel, ProgramActiveRequestModel, updateModel, UpdatewithDocModel } from '../../../../models/new-service';

// TODO: Import the correct ForeignEntrepreneurService and models if available


@Component({
  selector: 'app-foreigner-entrepreneur-overview',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './foreigner-entrepreneur-overview.component.html',
  styleUrl: './foreigner-entrepreneur-overview.component.scss'
})
export class ForeignerEntrepreneurOverviewComponent implements OnInit {
  projectId!: number;
  serviceRequestDetails = new ForeignEntrepreneurDetailsVM();
  statusList: any;
  previousStatus: any;
  nextStatus: any;
  showLoader: boolean = false;
  _userInfo: any;
  role!: string;
  roleId!: number;
  approveshowLoader: boolean = false;
  approveProjectRequestModel = new ApproveProjectRequestModel();
  rejectProjectRequestModel = new RejectProjectRequestModel();
  scheduleMeetingModel = new ScheduleMeetingModel();
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
  platFormOptions: any = ["Google Meet", "Zoom", "Teams"];
  timeSlotsByDate: any;
  availableSlot: any;
  currentUrl = window.location.pathname;
  employeeId: any;
  updatemodel = new updateModel();
  updatewithdocmodel = new UpdatewithDocModel();    

@ViewChild('serviceActiveModelPopUp') serviceActiveModelPopUp: TemplateRef<any> | undefined;
@ViewChild('modalPaymentDocsUploadPopUp') modalPaymentDocsUploadPopUp: TemplateRef<any> | undefined;
@ViewChild('modalFullDocsUploadPopUp') modalFullDocsUploadPopUp: TemplateRef<any> | undefined;
@ViewChild('modalSignedContractPopUp') modalSignedContractPopUp: TemplateRef<any> | undefined;
@ViewChild('modalSendContractPopUp') modalSendContractPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalApproveMethodPopUp') modalApproveMethodPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalRejectMethodPopUp') modalRejectMethodPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalMissingDocPopUp') modalMissingDocPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalScheduleMeetingPopUp') modalScheduleMeetingPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalPitchCompletePopUp') modalPitchCompletePopUp: TemplateRef<any> | undefined;
  @ViewChild('modalReviewPitchPopUp') modalReviewPitchPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalSendProposalPopUp') modalSendProposalPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalRejectIdeaModelPopUp') modalRejectIdeaModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalRejectProposalModelPopUp') modalRejectProposalModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalUploadPaymentProofModelPopUp') modalUploadPaymentProofModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalProgramActiveModelPopUp') modalProgramActiveModelPopUp: TemplateRef<any> | undefined;

  constructor(
    config: NgbAccordionConfig,
    private route: ActivatedRoute,
    private toaster: DisplaymessageComponent,
    private modalService: NgbModal,
  private feService: ForeignEntrepreneurService,
  ) {
    config.closeOthers = true;
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    document.getElementById('ngb-nav-0-panel')?.setAttribute('style', 'border:none;');
  const idParam = this.route.snapshot.queryParamMap.get('id');
    this.projectId = Number(idParam);
    this.getRequestDetails();
    this.availableSlots();
    if (this.currentUrl !== "/customer-project-track") {
      this._userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
      this.employeeId = this._userInfo.employeeId;
      var roles = JSON.parse(localStorage.getItem('roles') ?? '');
      this.role = roles[0].name;
      this.roleId = roles[0].id;
    } else {
      this.employeeId = 0;
      this.roleId = 1;
    }
    
  }

  navTabChange(panelId: any) {
    this.hideNavContentBorder(panelId);
  }

  hideNavContentBorder(panelId: any) {
    const _div = "ngb-nav-" + panelId + "-panel";
    const _element = document.getElementById(_div);
    if (_element) {
      _element.setAttribute('style', 'border:none;');
    }
  }

  // --- Add methods similar to PreacServiceOverviewComponent ---
  getRequestDetails() {
    if (!this.projectId) return;
    this.showLoader = true;
    this.feService.GetFERequestDetailsbyFeId(this.projectId).subscribe({
      next: (data) => {
        this.serviceRequestDetails = data.body.data;
        // Optionally call this.getProjectStatus(); if needed
        this.showLoader = false;
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', error.error.message);
        this.showLoader = false;
      }
    });
  }

  availableSlots() {
    // TODO: Replace with ForeignEntrepreneurService if available
    // this.jobService.GetAllAvailableSlot().subscribe({
    //   next: (user) => {
    //     if (user.body.success) {
    //       this.availableSlot = user.body.data;
    //     } else {
    //       this.toaster.displayErrorMessage('NMO', user.body.message);
    //     }
    //   },
    //   error: (error) => {
    //     this.toaster.displayErrorMessage('NMO', error.error.message);
    //   }
    // });
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

  Approve() {
    this.approveProjectRequestModel.EmployeeId = this._userInfo.employeeId;
    this.approveProjectRequestModel.ProjectId = this.projectId;
    this.approveshowLoader = true;
    this.feService.ApproveForeignRequest(this.approveProjectRequestModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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


  // Reject request
  RejectMethodPopUp() {
    this.rejectProjectRequestModel = new RejectProjectRequestModel();
    this.modalService.open(this.modalRejectMethodPopUp, { backdrop: 'static' });
  }

  Reject() {
    this.rejectProjectRequestModel.EmployeeId = this._userInfo.employeeId;
    this.rejectProjectRequestModel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.RejectForeignRequest(this.rejectProjectRequestModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Document Missing
  DocumentMissingPopUp() {
    this.rejectProjectRequestModel = new RejectProjectRequestModel();
    this.modalService.open(this.modalMissingDocPopUp, { backdrop: 'static' });
  }

  DocumentMissing() {
    this.rejectProjectRequestModel.EmployeeId = this._userInfo.employeeId;
    this.rejectProjectRequestModel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.MissingInfoForeignRequest(this.rejectProjectRequestModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Plan Approved
  PlanApproved() {
    this.updatemodel.EmployeeId = this._userInfo.employeeId;
    this.updatemodel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.ApprovePlan(this.updatemodel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.getRequestDetails();
        } else {
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

  // Plan Rejected
  PlanRejectedPopUp() {
    this.rejectProjectRequestModel = new RejectProjectRequestModel();
    this.modalService.open(this.modalRejectMethodPopUp, { backdrop: 'static' });
  }

  PlanRejected() {
    this.rejectProjectRequestModel.EmployeeId = this._userInfo.employeeId;
    this.rejectProjectRequestModel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.RejectPlan(this.rejectProjectRequestModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Send Contract
  SendContractPopUp() {
    this.updatewithdocmodel = new UpdatewithDocModel();
    this.modalService.open(this.modalSendContractPopUp, { backdrop: 'static' });
  }

  SendContract() {
    this.updatewithdocmodel.EmployeeId = this._userInfo.employeeId;
    this.updatewithdocmodel.ProjectId = this.projectId;
    this.updatewithdocmodel.Documents = this.documentList;
    this.showLoader = true;
    this.feService.SendContract(this.updatewithdocmodel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Document Submission
  DocumentSubmissionPopUp() {
    this.documentList = [];
    this.modalService.open(this.modalPitchCompletePopUp, { backdrop: 'static' });
  }

  DocumentSubmission() {
    this.updatewithdocmodel.EmployeeId = this._userInfo.employeeId;
    this.updatewithdocmodel.ProjectId = this.projectId;
    this.updatewithdocmodel.Documents = this.documentList;
    this.showLoader = true;
    this.feService.MissingInfoSubmitedForeignRequest(this.updatewithdocmodel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Signed Contract
  SignedContractPopUp() {
    this.updatewithdocmodel = new UpdatewithDocModel();
    this.modalService.open(this.modalSignedContractPopUp, { backdrop: 'static' });
  }

  SignedContract() {
    this.updatewithdocmodel.EmployeeId = this._userInfo.employeeId;
    this.updatewithdocmodel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.SignedContract(this.updatewithdocmodel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Full Document Upload
  FullDocumentUploadPopUp() {
    this.documentList = [];
    this.modalService.open(this.modalFullDocsUploadPopUp, { backdrop: 'static' });
  }

  FullDocumentUpload() {
    this.updatewithdocmodel.EmployeeId = this._userInfo.employeeId;
    this.updatewithdocmodel.ProjectId = this.projectId;
    this.updatewithdocmodel.Documents = this.documentList;
    this.showLoader = true;
    this.feService.UploadFullDocuments(this.updatewithdocmodel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Documents Verified
  DocumentVerified() {
    this.updatemodel.EmployeeId = this._userInfo.employeeId;
    this.updatemodel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.DocsVerified(this.updatemodel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.getRequestDetails();
        } else {
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


   // Payment Document Upload
  PaymentDocumentUploadPopUp() {
    this.documentList = [];
    this.modalService.open(this.modalPaymentDocsUploadPopUp, { backdrop: 'static' });
  }
  // Payment Done
  PaymentDone() {
     this.updatewithdocmodel.EmployeeId = this._userInfo.employeeId;
   this.updatewithdocmodel.ProjectId = this.projectId;
    this.updatewithdocmodel.Documents = this.documentList;
    this.showLoader = true;
    this.feService.PaymentDone(this.updatewithdocmodel).subscribe({
      next: (user) => {
        if (user.body.success) {
      this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

 
 
  // Service Active
  serviceActivePopUp() {
    this.updatemodel = new updateModel();
    this.modalService.open(this.serviceActiveModelPopUp, { backdrop: 'static' });
  }

  serviceActive() {
    this.updatemodel.EmployeeId = this._userInfo.employeeId;
    this.updatemodel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.ServiceActive(this.updatemodel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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







 
 
 
 
 
 
 
  // Schedule Meeting
  ScheduleMeetingMethodPopUp() {
    this.scheduleMeetingModel = new ScheduleMeetingModel();
    this.modalService.open(this.modalScheduleMeetingPopUp, { backdrop: 'static' });
  }

  GetSlotsByDate(slots: any) {
    this.timeSlotsByDate = slots
  }

  SelectSlot(timeSlot: any) {

  }

  AvailableSlots() {

    
  }

  ScheduleMeeting() {
    this.scheduleMeetingModel.EmployeeId = this._userInfo.employeeId;
    this.scheduleMeetingModel.ProjectID = this.projectId;
    this.showLoader = true;
    this.feService.ScheduleMeeting(this.scheduleMeetingModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Pitch Complete
  PitchCompleteMethodPopUp() {
    this.updatewithdocmodel = new UpdatewithDocModel();
    this.modalService.open(this.modalPitchCompletePopUp, { backdrop: 'static' });
  }

  PitchComplete() {
    this.updatewithdocmodel.EmployeeId = this._userInfo.employeeId;
    this.updatewithdocmodel.ProjectId = this.projectId;
    this.updatewithdocmodel.Documents = this.documentList;
    this.showLoader = true;
    this.feService.PitchComplete(this.updatewithdocmodel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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



  // Send Proposal
  SendProposalMethodPopUp() {
    this.sendProposalModel = new SendProposalModel();
    this.documentList = [];
    this.modalService.open(this.modalSendProposalPopUp, { backdrop: 'static' });
  }

  SendProposal() {
    this.sendProposalModel.EmployeeId = this._userInfo.employeeId;
    this.sendProposalModel.ProjectId = this.projectId;
    this.sendProposalModel.Documents = this.documentList;
    this.showLoader = true;
    this.feService.SendProposal(this.sendProposalModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

  // Reject Idea
  RejectIdeaMethodPopUp() {
    this.rejectIdeaModel = new RejectIdeaModel();
    this.modalService.open(this.modalRejectIdeaModelPopUp, { backdrop: 'static' });
  }

  RejectIdea() {
    this.rejectIdeaModel.EmployeeId = this._userInfo.employeeId;
    this.rejectIdeaModel.ProjectId = this.projectId;
    this.showLoader = true;
    // If you have a RejectIdea API, call it here. Otherwise, implement as needed.
    // Example: this.feService.RejectIdea(this.rejectIdeaModel).subscribe(...)
    this.showLoader = false;
  }


  


  // Accept Proposal
  AcceptProposal() {
    this.acceptProposalModel.EmployeeId = this._userInfo.employeeId;
    this.acceptProposalModel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.AcceptProposal(this.acceptProposalModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.getRequestDetails();
        } else {
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

  // Reject Proposal
  RejectProposalPopUp() {
    this.rejectProposalModel = new RejectProposalModel();
    this.modalService.open(this.modalRejectProposalModelPopUp, { backdrop: 'static' });
  }

  RejectProposal() {
    this.rejectProposalModel.EmployeeId = this._userInfo.employeeId;
    this.rejectProposalModel.ProjectId = this.projectId;
    this.showLoader = true;
    this.feService.RejectProposal(this.rejectProposalModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.getRequestDetails();
        } else {
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

 




  
  // Get Project Status (if needed)
  getProjectStatus() {
    // If you have a status API, call it here and update statusList, previousStatus, nextStatus
  }
  
}


