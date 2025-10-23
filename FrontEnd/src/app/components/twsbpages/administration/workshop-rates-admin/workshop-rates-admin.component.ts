import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { WorkshopRatesService } from '../../../../shared/services/twsbservices/workshop-rates.service';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkshopRate } from '../../../../models/WorkshopRates';
import { CompanyBranch } from '../../../../models/company';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-workshop-rates-admin',
  standalone: false,
 // imports: [],
  templateUrl: './workshop-rates-admin.component.html',
  styleUrl: './workshop-rates-admin.component.scss'
})

export class WorkshopRatesAdminComponent implements OnInit {
  WorkshopRateModel = new WorkshopRate();
  temps: WorkshopRate[] = [];
  WorkshopRateList: WorkshopRate[] = [];
  companyBranchList: CompanyBranch[] = [];
  @ViewChild('modalAddCompanyPopUp') modalAddCompanyPopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, 
    public router: Router,
    private modalService: NgbModal, 
    public workshopRatesService: WorkshopRatesService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.GetAllGetWorkshopRates();
    this.GetAllCompanyBranch();
  }

  GetAllGetWorkshopRates() {
    
    this.workshopRatesService.GetAllGetWorkshopRates().subscribe(x => {
      if (x.ok == true) {
        this.WorkshopRateList = x.body;
        this.temps =  x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetAllCompanyBranch() {
    
    this.workshopRatesService.GetAllCompanyBranch().subscribe(x => {
      if (x.ok == true) {
        this.companyBranchList = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

   AddWorkShopRatePopUp() {
    this.modalService.open(this.modalAddCompanyPopUp, { backdrop: 'static' });
    this.WorkshopRateModel = new WorkshopRate();
    this.WorkshopRateModel.rateAgreementId = 0
   }

  Submit() {
    if (this.WorkshopRateModel.companyBranchId == null || this.WorkshopRateModel.companyBranchId <= 0 || this.WorkshopRateModel.companyBranchId == undefined ||
      this.WorkshopRateModel.labourRate == null || this.WorkshopRateModel.labourRate <= 0 || this.WorkshopRateModel.labourRate == undefined ||
      this.WorkshopRateModel.paintRate == null || this.WorkshopRateModel.paintRate <=0 || this.WorkshopRateModel.paintRate == undefined ||
      this.WorkshopRateModel.partsMarkup == null || this.WorkshopRateModel.partsMarkup <= 0 || this.WorkshopRateModel.partsMarkup == undefined ||
      this.WorkshopRateModel.stripAssemblyRate == null || this.WorkshopRateModel.stripAssemblyRate <= 0 || this.WorkshopRateModel.stripAssemblyRate == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    
    this.workshopRatesService.AddRate(this.WorkshopRateModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Created Successfully");
          this.modalService.dismissAll();
          this.WorkshopRateModel = new WorkshopRate();
          this.WorkshopRateList = x.body.data;
          
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

   EditRate(item: any) {
    this.modalService.open(this.modalAddCompanyPopUp, { backdrop: 'static' });
    this.WorkshopRateModel = item;
  }


   Update() {
    if (this.WorkshopRateModel.companyBranchId == null || this.WorkshopRateModel.companyBranchId <= 0 || this.WorkshopRateModel.companyBranchId == undefined ||
      this.WorkshopRateModel.labourRate == null || this.WorkshopRateModel.labourRate <= 0 || this.WorkshopRateModel.labourRate == undefined ||
      this.WorkshopRateModel.paintRate == null || this.WorkshopRateModel.paintRate <=0 || this.WorkshopRateModel.paintRate == undefined ||
      this.WorkshopRateModel.partsMarkup == null || this.WorkshopRateModel.partsMarkup <= 0 || this.WorkshopRateModel.partsMarkup == undefined ||
      this.WorkshopRateModel.stripAssemblyRate == null || this.WorkshopRateModel.stripAssemblyRate <= 0 || this.WorkshopRateModel.stripAssemblyRate == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

  
    this.workshopRatesService.UpdatRate(this.WorkshopRateModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
          this.modalService.dismissAll();
          this.WorkshopRateModel = new WorkshopRate();
          this.WorkshopRateList = x.body.data;
          
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }
    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to update rate');
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.error);
      }
      
    });
   }

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.branchName != null && d.branchName != undefined && d.branchName != null
      ) {
        return d.branchName.toLowerCase().indexOf(val) !== -1 || !val ||
          d.rateDescription.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.WorkshopRateList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }
}
