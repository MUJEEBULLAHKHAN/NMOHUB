import { Component, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { UserRM, RegisterViewModel, roleResponse } from '../../../../models/user';
import { Workshops } from '../../../../models/Workshops';
import { AdministratorService } from '../../../../shared/services/twsbservices/administrator.service';
import { UserAuthService } from '../../../../shared/services/twsbservices/user-auth.service';
import SignaturePad from 'signature_pad';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.scss'
})
export class UserAdminComponent {

  users!: UserRM[];
  user = new UserRM();
  workshop: any;
  email: any;
  registerViewModel = new RegisterViewModel();
  workshops!: Workshops[];
  roles!: roleResponse[];
  roleId: any;
  temps: any;
  userWorkshopList:any[]=[];
  actionInProgress:boolean = false;
  addNewUserToWorkshop:boolean = false;
  selectedEmployeeId:any;
  selectedEmployeeEmailAddress:any;
  userRole:any;
  signPad: any;
  signed: any;
  @ViewChild('signPadCanvas', { static: false }) signaturePadElement: any;
  signImage: any;

  @ViewChild('modalAddUserPopUp') modalAddUserPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalUpdateUserPopUp') modalUpdateUserPopUp: TemplateRef<any> | undefined;

  RegisterViewModel: any;

  constructor(private route: Router, public router: Router, // public adminService: AdminService,
    public administratorService: AdministratorService,
    private toastr: DisplaymessageComponent,
    private modalService: NgbModal,
    private userAuthService: UserAuthService
  ) {
    let _roles = JSON.parse(localStorage.getItem('roles') as string);
    this.userRole = _roles[0].name
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  startSignPadDrawing(event: Event) {
  }

  movedFinger(event: Event) {
  }

  clearSignPad() {
    this.signPad.clear();
    this.signed = false;
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.GetAllUsers();
    this.GetAllRoles();
    this.GetAllWorkshops();
    
  }


  GetAllUsers() {
    this.administratorService.GetAllUsers().subscribe(x => {
      if (x.body.success == true) {
        this.users = x.body.users;
        this.temps = x.body.users;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetWorkshopUsers(workshopId: number) {
    this.userAuthService.GetWorkshopUsers(workshopId).subscribe(x => {
      if (x.ok == true) {
        this.users = x.body;
        this.temps = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetAllWorkshops() {
    this.administratorService.GetAllWorkshops().subscribe(x => {
      if (x.ok == true) {
        this.workshops = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetAllRoles() {
    
    this.administratorService.GetAllRoles().subscribe(x => {
      if (x.ok == true) {
        this.roles = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  AddUserPopUp() {
    this.registerViewModel = new RegisterViewModel();
    this.roleId = 0;
    this.modalService.open(this.modalAddUserPopUp, { backdrop: 'static' });

    setTimeout(() => {
      this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
    }, 1000);

  }

  Register() {
    if (this.registerViewModel.firstNames == null || this.registerViewModel.firstNames == "" || this.registerViewModel.firstNames == undefined ||
      this.registerViewModel.lastName == null || this.registerViewModel.lastName == "" || this.registerViewModel.lastName == undefined ||
      this.registerViewModel.jobTitle == null || this.registerViewModel.jobTitle == "" || this.registerViewModel.jobTitle == undefined ||
      this.registerViewModel.emailAddress == null || this.registerViewModel.emailAddress == "" || this.registerViewModel.emailAddress == undefined ||
      this.registerViewModel.password == null || this.registerViewModel.password == "" || this.registerViewModel.password == undefined ||
      this.registerViewModel.confirmPassword == null || this.registerViewModel.confirmPassword == "" || this.registerViewModel.confirmPassword == undefined ||
      this.registerViewModel.workshopId == null || this.registerViewModel.workshopId <= 0 || this.registerViewModel.workshopId == undefined ||
      this.roleId == null || this.roleId == "" || this.roleId == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    if (this.registerViewModel.password != this.registerViewModel.confirmPassword) {
      this.toastr.displayErrorMessage('NMO', "Password and Confirm Password Should be Match");
      return;
    }

    this.registerViewModel.roleIds = [this.roleId];
    this.registerViewModel.signatureData = this.signPad.toDataURL();
    this.administratorService.Register(this.registerViewModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Registration Successfully");
          this.modalService.dismissAll();
          
          this.ngOnInit();
          this.registerViewModel = new RegisterViewModel();
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

  EditUser(item: any) {
    this.modalService.open(this.modalUpdateUserPopUp, { backdrop: 'static' ,size: 'lg'});
    this.selectedEmployeeId = item.employeeId;
    this.selectedEmployeeEmailAddress = item.emailAddress;
    this.registerViewModel = item;
    this.roleId = item.roleId;
    this.registerViewModel.workshopId = item.workshopId;
    this.GetWorkshopsByUserName(item.emailAddress);
    this.signImage = environment.APIUrl + item.signatureUrl;
    setTimeout(() => {
      this.signPad = new SignaturePad(this.signaturePadElement.nativeElement);
    }, 1000);
  }

  UpdateUser() {
    this.registerViewModel.roleIds = [this.roleId];
    if (this.signPad != null && this.signPad != "" && this.signPad != undefined) {
      this.registerViewModel.signatureData = this.signPad.toDataURL();
    }
    this.administratorService.UpdateUser(this.registerViewModel).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "User Update Successfully");
          this.modalService.dismissAll();
          this.ngOnInit();
          this.registerViewModel = new RegisterViewModel();
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

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.emailAddress != null && d.lastName != undefined && d.firstNames != null
      ) {
        return d.emailAddress.toLowerCase().indexOf(val) !== -1 || !val ||
          d.firstNames.toLowerCase().indexOf(val) !== -1 || !val ||
          d.lastName.toLowerCase().indexOf(val) !== -1 || !val 
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }

  GetWorkshopsByUserName(username:any)
  {
    this.administratorService.WorkShopsByUsername(username).subscribe(data => {
      this.userWorkshopList = data.body;
    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.body.message);
    });
  }

  removeUserFromWorkshop(workshopId:any,userId:any,emailAddress:any)
  {
    this.actionInProgress = true;
    this.administratorService.RemoveUserFromWorkshop(workshopId,userId).subscribe(x => {
      this.toastr.displaySuccessMessage('NMO', "User has been removed from the selected workshop");
      this.GetWorkshopsByUserName(emailAddress);
      this.actionInProgress = false;
    }, (error) => {
      this.toastr.displayErrorMessage('NMO', 'Failed to load Workshop Detail');
      this.actionInProgress = false;
    })
  }

  activateUserAtWorkshop(workshopId:any,userId:any,emailAddress:any)
  {
    this.actionInProgress = true;
    this.administratorService.ReActivateUserAtWorkshop(workshopId,userId).subscribe(x => {
      this.toastr.displaySuccessMessage('NMO', "User has been enabled");
      this.GetWorkshopsByUserName(emailAddress);
      this.actionInProgress = false;
    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      this.actionInProgress = false;
    })
  }

  addUserToWorkshop()
  {
    this.addNewUserToWorkshop = true;
  }

  cancelAddNewUserToWorkshop()
  {
    this.addNewUserToWorkshop = false;
  }

  SaveNewUserToWorkshop(workshopId:any)
  {
    this.actionInProgress = true;
    this.administratorService.AddUserToNewWorkshop(workshopId,this.selectedEmployeeId).subscribe(x => {

      if(x.body.success == true)
      {
        this.toastr.displaySuccessMessage('NMO', x.body.message);
      }
      else
      {
        this.toastr.displayErrorMessage('NMO',  x.body.message);
      }
      this.GetWorkshopsByUserName(this.selectedEmployeeEmailAddress);
      this.actionInProgress = false;

    }, (error) => {
      this.toastr.displayErrorMessage('NMO',  error.message);
      this.actionInProgress = false;
    })
    
    this.cancelAddNewUserToWorkshop();
  }

  EnableDisableUser() {
    
    this.administratorService.EnableDisableUser(this.registerViewModel.employeeId, this.registerViewModel.isEnable).subscribe(x => {
      if (x.body.success == true) {
        this.toastr.displaySuccessMessage('success', "User Update Successfully");
        this.modalService.dismissAll();
        this.GetAllUsers();
        this.registerViewModel = new RegisterViewModel();
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }
  
}
