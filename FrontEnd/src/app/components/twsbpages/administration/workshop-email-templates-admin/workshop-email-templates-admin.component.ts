import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { WorkshopEmailTemplateService } from '../../../../shared/services/twsbservices/workshop-email-template.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkshopEmailTemplates } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-workshop-email-templates-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './workshop-email-templates-admin.component.html',
  styleUrl: './workshop-email-templates-admin.component.scss'
})
export class WorkshopEmailTemplatesAdminComponent {

  
  emailTemplatesModel = new WorkshopEmailTemplates();
  emailTemplatesList!: WorkshopEmailTemplates[];
  messageTypeList!: WorkshopEmailTemplates[];
  temps: any;
  showMessageTypeActionRow: boolean = false;
  emailTypeList: any;


  @ViewChild('modalWorkshopEmailTemplatePopUp') modalWorkshopEmailTemplatePopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public workshopEmailTemplateService: WorkshopEmailTemplateService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.emailTypeList = ["Quotation","Invoice", "OutstandingEmail", "ClearanceCertificate"]
    this.GetAllWorkshopEmailTemplate();
  }


  GetAllWorkshopEmailTemplate() {
    this.workshopEmailTemplateService.GetAllWorkshopEmailTemplate().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.emailTemplatesList = x.body.data;
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
  WorkshopEmailTemplatePopUp() {
    this.emailTemplatesModel = new WorkshopEmailTemplates();
    this.emailTemplatesModel.emailTemplateId = 0;
    this.modalService.open(this.modalWorkshopEmailTemplatePopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.emailTemplatesModel.templateFor == null || this.emailTemplatesModel.templateFor == "" || this.emailTemplatesModel.templateFor == undefined ||
      this.emailTemplatesModel.template == null || this.emailTemplatesModel.template == "" || this.emailTemplatesModel.template == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    
    this.workshopEmailTemplateService.CreateWorkshopEmailTemplate(this.emailTemplatesModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.emailTemplatesModel = new WorkshopEmailTemplates();
          this.modalService.dismissAll();
          
          this.GetAllWorkshopEmailTemplate();
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
    this.emailTemplatesModel = new WorkshopEmailTemplates();
    this.modalService.open(this.modalWorkshopEmailTemplatePopUp, { backdrop: 'static' });
    this.emailTemplatesModel = item;
  }

  UpdateWorkShopEmailTemplate() {
    if (this.emailTemplatesModel.templateFor == null || this.emailTemplatesModel.templateFor == "" || this.emailTemplatesModel.templateFor == undefined ||
      this.emailTemplatesModel.template == null || this.emailTemplatesModel.template == "" || this.emailTemplatesModel.template == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    
    this.workshopEmailTemplateService.UpdateWorkshopEmailTemplate(this.emailTemplatesModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();
        
        this.emailTemplatesModel = new WorkshopEmailTemplates();
        this.emailTemplatesModel.emailTemplateId = 0;
        this.GetAllWorkshopEmailTemplate();
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
    this.emailTemplatesList = temp;
  }
}
