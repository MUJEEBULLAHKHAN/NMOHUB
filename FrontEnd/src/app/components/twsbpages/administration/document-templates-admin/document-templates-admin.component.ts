import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { DocumentTemplateService } from '../../../../shared/services/twsbservices/document-template.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentTemplates } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-document-templates-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './document-templates-admin.component.html',
  styleUrl: './document-templates-admin.component.scss'
})
export class DocumentTemplatesAdminComponent {
  documentTemplatesModel = new DocumentTemplates();
  documentTemplatesList!: DocumentTemplates[];
  messageTypeList!: DocumentTemplates[];
  temps: any;
  showMessageTypeActionRow: boolean = false;
  documentTypeList: any;


  @ViewChild('modalDocumentTemplatePopUp') modalDocumentTemplatePopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public documentTemplateService: DocumentTemplateService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.documentTypeList = ["ClearanceCertificate"]
    this.GetAllDocumentTemplate();
  }


  GetAllDocumentTemplate() {
    this.documentTemplateService.GetAllDocumentTemplate().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.documentTemplatesList = x.body.data;
          this.temps = x.body.data;
          
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

  documentTemplatePopUp() {
    this.documentTemplatesModel = new DocumentTemplates();
    this.documentTemplatesModel.documentTemplateId = 0;
    this.modalService.open(this.modalDocumentTemplatePopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.documentTemplatesModel.type == null || this.documentTemplatesModel.type == "" || this.documentTemplatesModel.type == undefined ||
      this.documentTemplatesModel.template == null || this.documentTemplatesModel.template == "" || this.documentTemplatesModel.template == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    
    this.documentTemplateService.CreateDocumentTemplate(this.documentTemplatesModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.documentTemplatesModel = new DocumentTemplates();
          this.modalService.dismissAll();
          
          this.GetAllDocumentTemplate();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  EditEmailTempplate(item: any) {
    this.documentTemplatesModel = new DocumentTemplates();
    this.modalService.open(this.modalDocumentTemplatePopUp, { backdrop: 'static' });
    this.documentTemplatesModel = item;
  }

  UpdateDocumentTemplate() {
    if (this.documentTemplatesModel.type == null || this.documentTemplatesModel.type == "" || this.documentTemplatesModel.type == undefined ||
      this.documentTemplatesModel.template == null || this.documentTemplatesModel.template == "" || this.documentTemplatesModel.template == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    
    this.documentTemplateService.UpdateDocumentTemplate(this.documentTemplatesModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();
        
        this.documentTemplatesModel = new DocumentTemplates();
        this.documentTemplatesModel.documentTemplateId = 0;
        this.GetAllDocumentTemplate();
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.messageType != null && d.messageType != undefined && d.messageType != null
        && d.messageBody != null && d.messageBody != undefined && d.messageBody != null
      ) {
        return d.messageType.toLowerCase().indexOf(val) !== -1 || !val ||
          d.messageBody.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.documentTemplatesList = temp;
    
  }

}
