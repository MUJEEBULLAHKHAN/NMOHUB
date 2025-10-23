// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-vendor-admin',
//   standalone: false,
//  // imports: [],
//   templateUrl: './vendor-admin.component.html',
//   styleUrl: './vendor-admin.component.scss'
// })
// export class VendorAdminComponent {
//   constructor()
//   {
//     document.querySelector('.single-page-header')?.classList.add('d-none');
//   }
// }

import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../../../shared/services/twsbservices/company.service';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Company, CompanyBranch, CompanyTypes, ExternalCompanyEmail } from '../../../../models/company';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import {UserRM} from '../../../../models/user';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-vendor-admin',
  templateUrl: './vendor-admin.component.html',
  styleUrls: ['./vendor-admin.component.scss']
})
export class VendorAdminComponent implements OnInit {
  
  companyBranchModel = new CompanyBranch();
  temps: CompanyBranch[] = [];
  companyBranchList: CompanyBranch[] = [];
  CompanyTypeList: CompanyTypes[] = [];
  showCompanyTypeActionRow: boolean = false;
  newCompanyType = '';
  externalCompanyEmailModel = new ExternalCompanyEmail();
  externalCompanyEmailList: ExternalCompanyEmail[] = [];
  user =new UserRM();

  @ViewChild('modalAddCompanyPopUp') modalAddCompanyPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalExternalEmailPopUp') modalExternalEmailPopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router, 
    private modalService: NgbModal, 
    public companyService: CompanyService,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent

  ) {
        document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.GetAllCompanyBranch();
    this.GetAllCompanyType();
  }

  GetAllCompanyType() {
    
    this.companyService.GetAllCompanyType().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.CompanyTypeList = x.body.data;
          
        }
        else {
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

  GetAllCompanyBranch() {
    this.companyService.GetAllCompanyBranch().subscribe(x => {
      if (x.ok == true) {
        this.companyBranchList = x.body;
        this.temps = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  AddCompanyPopUp() {
    //this.workShopCourtesyCarsModel.courtesyCarId = 0;
    this.modalService.open(this.modalAddCompanyPopUp, { backdrop: 'static', size: 'lg' });
    this.companyBranchModel = new CompanyBranch();
    this.companyBranchModel.isOem = false;
    this.companyBranchModel.isPhysicalAddress = false;
    this.companyBranchModel.isVatExempt = false;
    this.companyBranchModel.companyBranchId = 0
  }

  Submit() {
    if (this.companyBranchModel.branchName == null || this.companyBranchModel.branchName == "" || this.companyBranchModel.branchName == undefined ||
      this.companyBranchModel.faxNo == null || this.companyBranchModel.faxNo == "" || this.companyBranchModel.faxNo == undefined ||
      this.companyBranchModel.companyTypeId == null || this.companyBranchModel.companyTypeId <= 0 || this.companyBranchModel.companyTypeId == undefined ||
      this.companyBranchModel.contactPerson == null || this.companyBranchModel.contactPerson == "" || this.companyBranchModel.contactPerson == undefined ||
      this.companyBranchModel.emailAddress == null || this.companyBranchModel.emailAddress == "" || this.companyBranchModel.emailAddress == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.companyService.CreateBranch(this.companyBranchModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Created Successfully");
          this.modalService.dismissAll();
          this.companyBranchModel = new CompanyBranch();
          this.GetAllCompanyBranch();
          
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

  EditBranchCompany(item: any) {
    this.modalService.open(this.modalAddCompanyPopUp, { backdrop: 'static', size: 'lg' });
    this.companyService.GetCompanyBranchByBranchId(item.companyBranchId).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.companyBranchModel = x.body.data;
          
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


  UpdateCompanyBranch() {
    if (this.companyBranchModel.branchName == null || this.companyBranchModel.branchName == "" || this.companyBranchModel.branchName == undefined ||
      this.companyBranchModel.faxNo == null || this.companyBranchModel.faxNo == "" || this.companyBranchModel.faxNo == undefined ||
      this.companyBranchModel.contactPerson == null || this.companyBranchModel.contactPerson == "" || this.companyBranchModel.contactPerson == undefined ||
      this.companyBranchModel.emailAddress == null || this.companyBranchModel.emailAddress == "" || this.companyBranchModel.emailAddress == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    
    this.companyService.UpdateBranch(this.companyBranchModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
          this.modalService.dismissAll();
          this.companyBranchModel = new CompanyBranch();
          this.companyBranchModel.companyBranchId = 0;
          this.GetAllCompanyBranch();
          
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
      if (d.branchName != null && d.branchName != undefined && d.branchName != null
        && d.telephone != null && d.telephone != undefined && d.telephone != null
      ) {
        return d.branchName.toLowerCase().indexOf(val) !== -1 || !val ||
          d.telephone.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.companyBranchList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }

  AddNewCompanyType() {

    this.showCompanyTypeActionRow = true;
  }
  cancelCompanyTypeAdd() {
    this.showCompanyTypeActionRow = false;
    this.newCompanyType = '';


  }

  submitNewCompanyType(companyType: any) {
    if (companyType == undefined || companyType == "" || companyType == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter Company Type");
      return;
    }
    let _company = new CompanyTypes();
    _company.companyTypeDescription = companyType;

    this.referenceService.UpdateCompanyType(_company).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'make added successfully');
        this.CompanyTypeList = x.body.data;
        
        this.cancelCompanyTypeAdd()
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetExternalEmailByCompanyBranchId(CompanyBranchId: number) {
    this.modalService.open(this.modalExternalEmailPopUp, { backdrop: 'static', size: 'lg' });
    
    this.externalCompanyEmailModel = new ExternalCompanyEmail();
    this.externalCompanyEmailModel.id = 0;
    this.externalCompanyEmailModel.companyBranchId = CompanyBranchId;
    this.referenceService.GetExternalEmailByCompanyBranchId(CompanyBranchId).subscribe(x => {
      if (x.ok == true) {
        this.externalCompanyEmailList = x.body.data;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  GetExternalEmailById(Item: any) {
    this.externalCompanyEmailModel = Item;
  }

  CreateExternalCompanyEmail() {
    if (this.externalCompanyEmailModel.emailAddress == null || this.externalCompanyEmailModel.emailAddress == "" || this.externalCompanyEmailModel.emailAddress == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    
    this.referenceService.CreateExternalCompanyEmail(this.externalCompanyEmailModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'Record Added successfully');
        this.externalCompanyEmailModel.id = 0;
        this.externalCompanyEmailModel.emailAddress = '';
        this.externalCompanyEmailList = x.body.data;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  UpdateExternalCompanyEmail() {
    if (this.externalCompanyEmailModel.emailAddress == null || this.externalCompanyEmailModel.emailAddress == "" || this.externalCompanyEmailModel.emailAddress == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    
    this.referenceService.UpdateExternalCompanyEmail(this.externalCompanyEmailModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'Record Updated successfully');
        this.externalCompanyEmailModel.id = 0;
        this.externalCompanyEmailModel.emailAddress = '';
        this.externalCompanyEmailList = x.body.data;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  DeleteExternalEmailById(Id: number) {
    
    this.referenceService.DeleteExternalEmailById(Id).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'Record deleted successfully');
        this.externalCompanyEmailList = x.body.data;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }
  
}
