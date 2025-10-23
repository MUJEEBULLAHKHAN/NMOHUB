import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationMethod } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-communication-method-admin',
  standalone: false,
  templateUrl: './communication-method-admin.component.html',
  styleUrl: './communication-method-admin.component.scss'
})
export class CommunicationMethodAdminComponent {
  
  communicationMethodModel = new CommunicationMethod();
  communicationMethodList!: CommunicationMethod[];
   temps: CommunicationMethod[] = [];
   showLoader: boolean = false;

  @ViewChild('modalCommunicationMethodPopUp') modalCommunicationMethodPopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
     this.GetAllCommunicationMethod();
  }


  GetAllCommunicationMethod() {
    this.showLoader = true;
    this.referenceService.GetAllCommunicationMethod().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.showLoader = false;
          this.communicationMethodList = x.body.data;
          this.temps =  x.body.data;
          
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          this.showLoader = false;
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false; 
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      this.showLoader = false;
    });
  }

  CommunicationMethodPopUp() {
    this.communicationMethodModel = new CommunicationMethod();
    this.communicationMethodModel.id = 0;
    this.modalService.open(this.modalCommunicationMethodPopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.communicationMethodModel.methodType == null || this.communicationMethodModel.methodType == "" || this.communicationMethodModel.methodType == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.showLoader = true;
    this.referenceService.CreateCommunicationMethod(this.communicationMethodModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.showLoader = false;
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.communicationMethodModel = new CommunicationMethod();
          this.modalService.dismissAll();
          
          this.GetAllCommunicationMethod();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          this.showLoader = false;
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false;
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to create role');
        this.showLoader = false;
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
        this.showLoader = false;
      }
    });
  }

  EditCommunicationMethod(item: any) {
    this.communicationMethodModel = new CommunicationMethod();
    this.modalService.open(this.modalCommunicationMethodPopUp, { backdrop: 'static' });
    this.communicationMethodModel = item;
  }

  Update() {
    if (this.communicationMethodModel.methodType == null || this.communicationMethodModel.methodType == "" || this.communicationMethodModel.methodType == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.referenceService.UpdateCommunicationMethod(this.communicationMethodModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();
        
        this.communicationMethodModel = new CommunicationMethod();
        this.communicationMethodModel.id = 0;
        this.GetAllCommunicationMethod();
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to update role');
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
      if (d.methodType != null && d.methodType != undefined && d.methodType != null
      ) {
        return d.methodType.toLowerCase().indexOf(val) !== -1 || !val ;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.communicationMethodList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

}
