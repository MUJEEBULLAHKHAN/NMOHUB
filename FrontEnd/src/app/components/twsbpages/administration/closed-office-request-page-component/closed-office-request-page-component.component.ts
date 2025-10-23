import { CommonModule, DatePipe } from '@angular/common';
import { Component, model, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { NMOService } from '../../../../shared/services/new.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DocumentData
} from '../../../../models/new-service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../../environments/environment';
import { ReportService } from '../../../../services/report.service';

@Component({
  selector: 'app-closed-office-request-page-component',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, CommonModule, FormsModule, NgSelectModule],
  templateUrl: './closed-office-request-page-component.component.html',
  styleUrl: './closed-office-request-page-component.component.scss',
  providers: [DisplaymessageComponent]

})
export class ClosedOfficeRequestPageComponentComponent {

  @ViewChild('documentModelPopUp') documentModelPopUp: TemplateRef<any> | undefined;


  closedOfficeRequests: any[] = [];
  showLoader = false;
  closedSpaceLoader = false;
  _userInfo: any;
  roles: any;
  documentType: any;
  documentList: any[] = [];
  documentTypesList: any[] = [];
  closedRequest: any = {};
  APIURL: any;
  documents: any[] = [];

  constructor(
    private nmoService: NMOService,
    private fb: FormBuilder,
    private toastr: DisplaymessageComponent,
    private modalService: NgbModal,
    private reportService: ReportService
  ) {
    this._userInfo = JSON.parse(localStorage.getItem('userdetails') as string);
    this.roles = JSON.parse(localStorage.getItem('roles') as string);
    console.log(this.roles, 'roles');
    console.log(this._userInfo, '_userInfo');
    console.log(this.roles[0]?.id, 'this.roles[0]?.id');
  }
  ngOnInit(): void {
    this.APIURL = environment.APIUrl;
    this.documentTypesList = [
      { documentId: 1, documentType: "Payment Receipt", documentCode: "PR" },
    ]
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.getClosedOfficeRequests();
  }

generateReport() {
    const statusId = 0; // You can change this or get from filter
    this.reportService.exportClosedOfficeList(statusId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CO_${new Date().toISOString().replace(/[:.]/g, '_')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  ngOnDestroy() {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }
  getClosedOfficeRequests() {
    this.showLoader = true;

    let apiCall;
    if (this.roles[0]?.id == 10) {
      // Super Admin / Admin → Get all
      apiCall = this.nmoService.GetAllClosedOfficeRequest();
    } else {
      // Normal User → Get by EmployeeId
      apiCall = this.nmoService.GetAllClosedOfficeRequestByEmployeeId(this._userInfo?.employeeId);
    }

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.closedOfficeRequests = res.body.data;
        } else {
          this.toastr.displayErrorMessage('NMO', 'Failed to load Closed Office Requests');
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching closed office requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }

  ApproveClosedOfficeRequest(id: any) {
    this.showLoader = true;

    let apiCall;

    apiCall = this.nmoService.ApproveClosedOfficeRequest(id);

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.getClosedOfficeRequests();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body?.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }

  RejectClosedOfficeRequest(id: any) {
    this.showLoader = true;

    let apiCall;

    apiCall = this.nmoService.RejectClosedOfficeRequest(id);

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.getClosedOfficeRequests();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body?.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }

  GetAllDocuments(id: any) {
    this.showLoader = true;

    let apiCall;

    apiCall = this.nmoService.GetDocumentsClosedOffice(id);

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.documents = res.body?.data;
        } else {
          this.toastr.displayErrorMessage('NMO', res.body?.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }

  OpenDocumentModel(model: any) {

    this.GetAllDocuments(model.closedOfficeRequestId)
    this.documentList = [];
    this.closedRequest = model;
    this.modalService.open(this.documentModelPopUp, { backdrop: 'static', size: 'lg' });
  }

  closeDocumentPopup() {
    this.modalService.dismissAll();
  }

  onFileSelected(event: any) {

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

      if (file != null) {
        let document = new DocumentData();
        document.DocumentType = this.documentType;
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

  cleanBase64Data(data: any): string {
    return data.replace(/^data:[^;]+;base64,/, '');
  }

  UploadDocument() {

    if (this.documentList.length <= 0 || this.documentList == undefined || this.documentList == null) {
      this.toastr.displayErrorMessage('NMO', "Please Select Document");
      return;
    }

    this.showLoader = true;

    let apiCall;

    let model = {
      'EmployeeId': this._userInfo.employeeId,
      'documentlist': this.documentList,
      'ClosedOfficeRequestId': this.closedRequest.closedOfficeRequestId
    }

    apiCall = this.nmoService.UploadDocumentClosedOfficeRequest(model);

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.documents = res.body?.data;
          this.getClosedOfficeRequests();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body?.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }

    ActivateCoWorkingSpaceRequest(id: any) {
    this.showLoader = true;

    let apiCall;

    apiCall = this.nmoService.ActivateCoWorkingSpaceRequest(id);

    apiCall.subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.body?.success) {
          this.getClosedOfficeRequests();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body?.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        console.error('Error fetching meeting requests:', err);
        this.toastr.displayErrorMessage('NMO', 'Something went wrong while fetching data');
      }
    });
  }
  

  getFileExtension(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase(); // Get the part after the last dot and convert to lowercase
    return ("." + extension) || ''; // Return the extension or an empty string if no extension is found
  }
}
