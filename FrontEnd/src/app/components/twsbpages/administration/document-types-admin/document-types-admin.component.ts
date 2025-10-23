import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentTypes } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-document-types-admin',
  standalone: false,
  templateUrl: './document-types-admin.component.html',
  styleUrl: './document-types-admin.component.scss'
})
export class DocumentTypesAdminComponent {
  
  documentTypesModel = new DocumentTypes();
  documentTypesList!: DocumentTypes[];
   temps: DocumentTypes[] = [];


  @ViewChild('modalDocumentTypePopUp') modalDocumentTypePopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
     this.GetAllDocumentTypes();
  }


  GetAllDocumentTypes() {
    
    this.referenceService.GetAllDocumentTypes().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.documentTypesList = x.body.data;
          this.temps =  x.body.data;
          
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  DocumentTypePopUp() {
    this.documentTypesModel = new DocumentTypes();
    this.documentTypesModel.documentId = 0;
    this.modalService.open(this.modalDocumentTypePopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.documentTypesModel.documentType == null || this.documentTypesModel.documentType == "" || this.documentTypesModel.documentType == undefined ||
      this.documentTypesModel.documentCode == null || this.documentTypesModel.documentCode == "" || this.documentTypesModel.documentCode == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    this.referenceService.CreateDocumentTypes(this.documentTypesModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.documentTypesModel = new DocumentTypes();
          this.modalService.dismissAll();
          
          this.GetAllDocumentTypes();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to create document type');
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
        
      }
    });
  }

  EditDocumentType(item: any) {
    this.documentTypesModel = new DocumentTypes();
    this.modalService.open(this.modalDocumentTypePopUp, { backdrop: 'static' });
    this.documentTypesModel = item;
  }

  Update() {
    if (this.documentTypesModel.documentType == null || this.documentTypesModel.documentType == "" || this.documentTypesModel.documentType == undefined ||
      this.documentTypesModel.documentCode == null || this.documentTypesModel.documentCode == "" || this.documentTypesModel.documentCode == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.referenceService.UpdateDocumentTypes(this.documentTypesModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();
        
        this.documentTypesModel = new DocumentTypes();
        this.documentTypesModel.documentId = 0;
        this.GetAllDocumentTypes();
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to update document type');
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
      }
      
    });
  }

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.documentType != null && d.documentType != undefined && d.documentType != null
        && d.documentCode != null && d.documentCode != undefined && d.documentCode != null
      ) {
        return d.documentType.toLowerCase().indexOf(val) !== -1 || !val ||
          d.documentCode.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.documentTypesList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

}
