import { Component, Input, input, TemplateRef, viewChild, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../../../shared/services/twsbservices/job.service';
import { ActivatedRoute } from '@angular/router';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { WorkshopCourtesyCarsService } from '../../../../shared/services/twsbservices/workshop-courtesy-cars.service';
import { CourtesyCarLog } from '../../../../models/WorkShopCourtesyCars';
import { NMOService } from '../../../../shared/services/new.service';
import { PaymentActivity, DocumentData } from '../../../../models/new-service';
import { th } from 'date-fns/locale';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-service-payment',
  standalone: false,
  // imports: [],
  templateUrl: './service-payment.component.html',
  styleUrl: './service-payment.component.scss'
})




export class ServicePaymentComponent implements OnChanges {
  @ViewChild('paymentModelPopUp') paymentModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('rejectPaymentModelPopUp') rejectPaymentModelPopUp: TemplateRef<any> | undefined;

  paymentList: PaymentActivity[] = [];
  paymentActivity = new PaymentActivity();
  paymentTypeList = ["First Installment", "Second Installment", "Third Installment", "Forth Installment", "Partial Payment", "Full Payment"]
  documentList: DocumentData[] = [];
  projectId!: number;
  APIURL: any;
  paymentRejectModel = new PaymentActivity();
  paymentDeclineReason: any;
  role!: string;
  roleId!: number;
  showLoader: boolean = false;
  showLoaderAcceptReject: boolean = false;
  IsPaymentDocumentFile: boolean = false;
  serviceId: any;

  _userInfo: any;
  currentUrl = window.location.pathname; // Getting the full URL
  employeeId: any;

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
  }

  ngOnInit() {
    // var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    // console.log("Role INFO IS ", roles);
    // this.role = roles[0].name;
    // this.roleId = roles[0].id;

    this.APIURL = environment.APIUrl;
    const idParam = this.route.snapshot.queryParamMap.get('id');
    this.projectId = Number(idParam);

    this.GetAllPaymentActivityByProjectId();
  }

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

  }

  CreateNewPaymentPopUp() {
    this.modalService.open(this.paymentModelPopUp, { backdrop: 'static', size: 'ms' });
  }

  closeDocumentPopup() {
    this.modalService.dismissAll();
  }

  CreatePaymentActivity() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }

    this.showLoader = true;
    this.jobService.CreatePaymentActivity(id).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.GetAllPaymentActivityByProjectId();
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

  GetAllPaymentActivityByProjectId() {
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }
    this.jobService.GetAllPaymentActivityByProjectId(id, this.serviceId).subscribe({
      next: (data) => {
        this.paymentList = data.body.data;
      },
      error: (error) => {
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }

  RemoveFile() {
    this.documentList = [];
    this.IsPaymentDocumentFile = false;
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

      var document = this.documentList.filter(x => x.DocumentType == this.paymentActivity.paymentName)

      if (document.length > 0) {
        this.toaster.displayErrorMessage("NMO", DocumentType + " Already Exist If you Upload Again Then Remove First")
        return;
      }

      if (file != null) {

        this.IsPaymentDocumentFile = true

        let document = new DocumentData();
        document.DocumentType = this.paymentActivity.paymentName;
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

  Payment() {



    if (this.paymentActivity.amount == null || this.paymentActivity.amount == "" ||
      this.paymentActivity.amount == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Amount");
      return;
    }


    if (this.paymentActivity.paymentName == null || this.paymentActivity.paymentName == "" ||
      this.paymentActivity.paymentName == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter Payment Type");
      return;
    }

    if (this.documentList == null || this.documentList.length <= 0 ||
      this.documentList == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Add At Least One Document ");
      return;
    }

    this.paymentActivity.projectId = this.projectId;
    this.paymentActivity.document = this.documentList[0];

    this.showLoader = true;
    this.jobService.CreatePaymentActivity(this.paymentActivity).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.paymentActivity = new PaymentActivity();
          this.documentList = [];
          this.GetAllPaymentActivityByProjectId();
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




  AcceptPayment(item: any) {
    item.isVerified = true;

    this.showLoaderAcceptReject = true;
    this.jobService.AcceptRejectPayment(item).subscribe({
      next: (user) => {
        if (user.body.success) {
          // this.GetAllPaymentActivityByProjectId();
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
          this.showLoaderAcceptReject = false;
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', error.error.message);
        this.showLoaderAcceptReject = false;
      },
      complete: () => {
        this.showLoaderAcceptReject = false;
        this.GetAllPaymentActivityByProjectId();
      }
    });
  }

  RejectPaymentPopUp(item: any) {
    this.paymentRejectModel = item;
    this.modalService.open(this.rejectPaymentModelPopUp, { backdrop: 'static', size: 'ms' });
  }

  RejectPayment() {

    if (this.paymentDeclineReason == null || this.paymentDeclineReason == "" ||
      this.paymentDeclineReason == undefined
    ) {
      this.toaster.displayErrorMessage('NMO', "Please Enter payment Decline Reason");
      return;
    }


    this.paymentRejectModel.declineReason = this.paymentDeclineReason;
    this.paymentRejectModel.isVerified = false;

    this.showLoader = true;
    this.jobService.AcceptRejectPayment(this.paymentRejectModel).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.modalService.dismissAll();
          this.paymentDeclineReason == null
          //this.GetAllPaymentActivityByProjectId();
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
        this.GetAllPaymentActivityByProjectId();
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

}
