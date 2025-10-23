import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Disclaimer } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-disclaimer-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './disclaimer-admin.component.html',
  styleUrl: './disclaimer-admin.component.scss'
})
export class DisclaimerAdminComponent {

  
  disclaimerModel = new Disclaimer();
  disclaimerList!: Disclaimer[];
  
  temps!: Disclaimer[];
  showMessageTypeActionRow: boolean = false;


  @ViewChild('modalDisclaimerPopUp') modalDisclaimerPopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.GetAllDisclaimer();
  }


  GetAllDisclaimer() {
    this.referenceService.GetAllDisclaimer().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.disclaimerList = x.body.data;
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

  DisclaimerPopUp() {
    this.disclaimerModel = new Disclaimer();
    this.disclaimerModel.disclaimerTypeId = 0;
    this.modalService.open(this.modalDisclaimerPopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.disclaimerModel.disclaimerType == null || this.disclaimerModel.disclaimerType == "" || this.disclaimerModel.disclaimerType == undefined ||
      this.disclaimerModel.disclaimerText == null || this.disclaimerModel.disclaimerText == "" || this.disclaimerModel.disclaimerText == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    this.referenceService.CreateDisclaimers(this.disclaimerModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.disclaimerModel = new Disclaimer();
          this.modalService.dismissAll();
          
          this.GetAllDisclaimer();
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

  EditDisclaimer(item: any) {
    this.disclaimerModel = new Disclaimer();
    this.modalService.open(this.modalDisclaimerPopUp, { backdrop: 'static' });
    this.disclaimerModel = item;
  }

  Update() {
    if (this.disclaimerModel.disclaimerType == null || this.disclaimerModel.disclaimerType == "" || this.disclaimerModel.disclaimerType == undefined ||
      this.disclaimerModel.disclaimerText == null || this.disclaimerModel.disclaimerText == "" || this.disclaimerModel.disclaimerText == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    
    this.referenceService.UpdateDisclaimer(this.disclaimerModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();
        
        this.disclaimerModel = new Disclaimer();
        this.disclaimerModel.disclaimerTypeId = 0;
        this.GetAllDisclaimer();
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

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.disclaimerType != null && d.disclaimerType != undefined && d.disclaimerType != null
        && d.disclaimerText != null && d.disclaimerText != undefined && d.disclaimerText != null
      ) {
        return d.disclaimerType.toLowerCase().indexOf(val) !== -1 || !val ||
          d.disclaimerText.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.disclaimerList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }
}
