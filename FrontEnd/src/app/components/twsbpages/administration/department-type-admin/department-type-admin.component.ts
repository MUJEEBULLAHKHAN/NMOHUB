import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentType, DepartmentCategories } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { UserRM } from '../../../../models/user';
@Component({
  selector: 'app-department-type-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './department-type-admin.component.html',
  styleUrl: './department-type-admin.component.scss'
})
export class DepartmentTypeAdminComponent {

  user = new UserRM();
  departmentTypeModel = new DepartmentType();
  departmentTypeList!: DepartmentType[];
  departmentCategoryList!: DepartmentCategories[];
  temps!: DepartmentType[];
  showMessageTypeActionRow: boolean = false;


  @ViewChild('modalDepartmentTypePopUp') modalDepartmentTypePopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.GetAllDepartmentType();
    this.GetAllDepartmentCategories();
  }
  

  GetAllDepartmentCategories() {
    this.referenceService.GetAllDepartmentCategories().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.departmentCategoryList = x.body.data;
          
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

  GetAllDepartmentType() {
    this.referenceService.GetAllDepartmentType().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.departmentTypeList = x.body.data;
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

  AddDepartmentPopUp() {
    this.departmentTypeModel = new DepartmentType();
    this.departmentTypeModel.departmentTypeId = 0;
    this.modalService.open(this.modalDepartmentTypePopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.departmentTypeModel.categoryId == null || this.departmentTypeModel.categoryId <= 0 || this.departmentTypeModel.categoryId == undefined ||
      this.departmentTypeModel.type == null || this.departmentTypeModel.type == "" || this.departmentTypeModel.type == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.referenceService.CreateDepartmentType(this.departmentTypeModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.departmentTypeModel = new DepartmentType();
          this.modalService.dismissAll();
          
          this.GetAllDepartmentType();
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

  Delete(departmentTypeId: number) {
    this.referenceService.DeleteDepartmentType(departmentTypeId).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Deleted Successfully");
        this.GetAllDepartmentType();
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
      if (d.type != null && d.type != undefined && d.type != null
        && d.categoryDescription != null && d.categoryDescription != undefined && d.categoryDescription != null
      ) {
        return d.type.toLowerCase().indexOf(val) !== -1 || !val ||
          d.categoryDescription.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.departmentTypeList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }
}
