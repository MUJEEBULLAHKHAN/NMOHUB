import { Component, TemplateRef, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { DocumentTypes } from '../../../../models/Reference';
import { JobService } from '../../../../shared/services/twsbservices/job.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { NMOService } from '../../../../shared/services/new.service';



@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-service-documents',
  standalone: false,
  // imports: [],
  templateUrl: './service-documents.component.html',
  styleUrl: './service-documents.component.scss'
})
export class ServiceDocumentsComponent {
  @ViewChild('documentModelPopUp') documentModelPopUp: TemplateRef<any> | undefined;
  @ViewChild('deleteDocumentConfPopUp') deleteDocumentConfPopUp: TemplateRef<any> | undefined;


  @Input() serviceRequestDetails: any;
  showLoader: boolean = false;
  documentTypeId!: number;
  documents: any = [];
  temp: any = [];
  documentId: any;
  APIURL: any;
  serviceId: any;

  constructor(private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toaster: DisplaymessageComponent,
    private jobService: NMOService,
    private route: ActivatedRoute,
  ) {
      this.serviceId= this.route.snapshot.queryParamMap.get('serv');
  }


  documentTypesList!: DocumentTypes[];

  ngOnInit() {
    this.APIURL = environment.APIUrl;
    this.documentTypesList = [
      { documentId: 1, documentType: "Payment Receipt", documentCode: "PR" },
    ]
    this.GetDocumentsByProject();
  }

  CreateNewDocument() {
    this.modalService.open(this.documentModelPopUp, { backdrop: 'static', size: 'lg' });
  }

  closeDocumentPopup() {
    this.modalService.dismissAll();
  }

  GetDocumentsByProject() {
    this.showLoader = true;
    const idParam = this.route.snapshot.queryParamMap.get('id');
    const id = Number(idParam);
    if (!id) {
      this.toaster.displayErrorMessage('NMO', 'No Service Request ID found');
      return;
    }
    this.jobService.GetDocumentsByProject(id, this.serviceId).subscribe({
      next: (data) => {
        this.showLoader = false;
        this.documents = data.body;
      },
      error: (error) => {
        this.showLoader = false;
        console.error('Error fetching service request details:', error);
        this.toaster.displayErrorMessage('NMO', error.error.message);
      }
    });
  }

  DeleteDocumentConfPopup(documentId: any) {
    this.documentId = documentId;
    this.modalService.open(this.deleteDocumentConfPopUp, { backdrop: 'static', size: 'lg' });
  }

  DeleteDocument() {
    this.showLoader = true;
    this.jobService.DeleteJobDocument(this.documentId).subscribe({
      next: (data) => {
       this.toaster.displaySuccessMessage('NMO', "Removed Successfully");
          this.GetDocumentsByProject();
          this.modalService.dismissAll();
      },
      error: (error) => {
        this.showLoader = false;
        this.toaster.displayErrorMessage('NMO', 'An Error Occured. Failed to Delete Document');
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

}




