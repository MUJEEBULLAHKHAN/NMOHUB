import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkshopCSIField, WorkshopCSIFieldType } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-csi-submission-fields-admin',
  standalone: false,
  // imports: [],
  templateUrl: './csi-submission-fields-admin.component.html',
  styleUrl: './csi-submission-fields-admin.component.scss'
})
export class CSISubmissionFieldsAdminComponent {

  workshopCSIFieldModel = new WorkshopCSIField();
  workshopCSIFieldList!: WorkshopCSIFieldType[];
  temps: WorkshopCSIFieldType[] = [];


  @ViewChild('modalWorkshopCSIFieldPopUp') modalWorkshopCSIFieldPopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.GetAllWorkshopCSIField();
  }


  GetAllWorkshopCSIField() {
    
    this.referenceService.GetAllWorkshopCSIField().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.workshopCSIFieldList = x.body.data;
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

  WorkshopCSIFieldPopUpPopUp() {
    this.workshopCSIFieldModel = new WorkshopCSIField();
    this.workshopCSIFieldModel.workshopCSIFieldId = 0;
    this.modalService.open(this.modalWorkshopCSIFieldPopUp, { backdrop: 'static' });
  }

  EditWorkshopCSIField(item: any) {
    this.workshopCSIFieldModel = new WorkshopCSIField();
    this.modalService.open(this.modalWorkshopCSIFieldPopUp, { backdrop: 'static' });
    this.workshopCSIFieldModel = item;
  }

  Submit() {
    const allWorkshopCSIFields = this.workshopCSIFieldList.map(x=>x.workshopCSIFieldList, this.workshopCSIFieldList).flat();
    this.referenceService.UpdateWorkshopCSIField(allWorkshopCSIFields).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success == true) {
          this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
          
          this.GetAllWorkshopCSIField();
        }
        else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          this.GetAllWorkshopCSIField();
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.GetAllWorkshopCSIField();
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to submit CSI');
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
      }
      
    });
  }

  OpenAccordian(item: any) {
    if (item.accordionHeadingclass == "show") {
      item.accordionHeadingclass = "";
    }
    else {
      item.accordionHeadingclass = "show";
    }
  }

  CollapseAll() {
    for (const item of this.workshopCSIFieldList) {
      item.accordionHeadingclass = "show"
    }
  }

  Closell() {
    for (const item of this.workshopCSIFieldList) {
      item.accordionHeadingclass = ""
    }
  }

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.csiField != null && d.csiField != undefined && d.csiField != null
      ) {
        return d.csiField.toLowerCase().indexOf(val) !== -1 || !val
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.workshopCSIFieldList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

}
