import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { UserRM } from '../../../../models/user';

@Component({
  providers: [DisplaymessageComponent],
  selector: 'app-roles-admin',
  standalone: false,
  templateUrl: './roles-admin.component.html',
  styleUrl: './roles-admin.component.scss'
})
export class RolesAdminComponent {
  
  roleModel = new Role();
  roleList!: Role[];
   temps: Role[] = [];
 user = new UserRM();

  @ViewChild('modalRolePopUp') modalRolePopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
     this.GetAllRoles();
  }


  GetAllRoles() {
    
    this.referenceService.GetAllRoles().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.roleList = x.body.data;
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

  RolePopUp() {
    this.roleModel = new Role();
    this.roleModel.id = "";
    this.modalService.open(this.modalRolePopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.roleModel.name == null || this.roleModel.name == "" || this.roleModel.name == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    this.referenceService.CreateRoles(this.roleModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.roleModel = new Role();
          this.modalService.dismissAll();
          
          this.GetAllRoles();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to create role');
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
        
      }
    });
  }

  EditRole(item: any) {
    this.roleModel = new Role();
    this.modalService.open(this.modalRolePopUp, { backdrop: 'static' });
    this.roleModel = item;
  }

  Update() {
    if (this.roleModel.name == null || this.roleModel.name == "" || this.roleModel.name == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.referenceService.UpdateRoles(this.roleModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();
        
        this.roleModel = new Role();
        this.roleModel.id = "";
        this.GetAllRoles();
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
      if (d.name != null && d.name != undefined && d.name != null
      ) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val ;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.roleList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

}
