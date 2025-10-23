import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../../../../shared/services/twsbservices/workshop.service';
import { AppComponent } from '../../../../app.component';
import {UserRM} from '../../../../models/user';
import {Workshops} from '../../../../models/Workshops';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import {Make, ModelType} from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { DepartmentType, DepartmentCategories } from '../../../../models/Reference';
import { StatusupdatesService } from '../../../../shared/services/twsbservices/statusupdates.service';
import { da } from 'date-fns/locale';


@Component({
  selector: 'app-sub-activities-admin',
  standalone: false,
 // imports: [],
 providers: [DisplaymessageComponent],
  templateUrl: './sub-activities-admin.component.html',
  styleUrl: './sub-activitie-admin.component.scss'
})
export class SubActivitiesAdminComponent {
 
  user =new UserRM();
  // vehicleMakeList: Make[] = [];
  // vehicleModelList:ModelType[]=[];
  // masterVehicleMakeList=[];
  // masterVehicleModelList=[];
  // modelSelected:boolean=false;
  // selectedMake:any;
  // selectedMakeId!: number;
   showMakeActionRow:boolean=false;
  // showModelActionRow:boolean=false;
  categoryId: any;
  departmentName: any;
  departmentTypeModel = new DepartmentType();
    departmentTypeList!: DepartmentType[];
    departmentCategoryList!: DepartmentCategories[];
    subDepartmentOptions:any[] =[];


  @ViewChild('modalAddWorkshopPopUp') modalAddWorkshopPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalUpdateWorkshopPopUp') modalUpdateWorkshopPopUp: TemplateRef<any> | undefined;
  showModelActionRow:boolean=false;
  departmentTypeSelected: boolean = false;
  selectedDepartmentId: any;
  showSubModelActionRow: boolean = false;
  showLoader: boolean = false;
  showExistingSubDepartmentDropDown:boolean=false;
  existingSubDepartments:any[]=[];

  
  //workshop: any;

  constructor(private route: ActivatedRoute, public router: Router, public workshopService: WorkshopService,
    public appComponent: AppComponent, public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent,
    private statusUpdate : StatusupdatesService,
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    
    this.user = JSON.parse( localStorage.getItem('userdetails') as string)
    this.GetAllDepartmentType();
  }

  GetAllSubDepartments()
  {
    this.referenceService.GetAllSubDepartmentTypes().subscribe({
      next: (data) => 
      {
          this.existingSubDepartments = data.body;
      },     
      error: (error) =>
      {
        this.toastr.displayErrorMessage('NMO','Failed to get SubDepartments');
      },
      complete: () => {

      } 
  });
  }

  GetAllDepartmentType() {
    this.referenceService.GetAllDepartmentType().subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.departmentTypeList = x.body.data;
          
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

  OnDepartmentChanged(departmentId:any, departmentType: any)
  {
    this.departmentName = departmentType
    let _departmentId = departmentId;
    this.selectedDepartmentId = _departmentId;
    this.statusUpdate.GetSubDepartmentByDepartmentId(_departmentId).subscribe({
      next: (data) => 
      {
          this.subDepartmentOptions = data.body;

          this.subDepartmentOptions.forEach(x => {
            x.isSelcted = true;
          })

          this.departmentTypeSelected = true;
      },     
      error: (error) =>
      {
        this.toastr.displayErrorMessage('NMO','Failed to get Status Updates');
      },
      complete: () => {
        // this.showEmployeeList = true;
        // this.getEmployeeListing();
      } 
  });
  }


  AddSubDepartmentModel() {
    this.GetAllSubDepartments();
   this.showExistingSubDepartmentDropDown = true; 
  }

  cancelSubDepartment()
  {
    this.showSubModelActionRow = false; 
    this.showExistingSubDepartmentDropDown = false;
  }

  AddExistingSubDepartmentToDepartment(activityId:any)
  {
    this.statusUpdate.AddExistingSubDepartmentToDepartment(this.selectedDepartmentId,activityId).subscribe({
      next: (data) => 
      {
        this.toastr.displaySuccessMessage('NMO', data.body.message);
      },     
      error: (error) =>
      {
        this.toastr.displayErrorMessage('NMO',error.error.message);
      },
      complete: () => {
        this.OnDepartmentChanged(this.selectedDepartmentId,this.departmentName);
      } 
  });
  }

  AddSubDepartment(subdepartment: any) {

    if(subdepartment==undefined || subdepartment== null || subdepartment=="") {
      this.toastr.displayErrorMessage('NMO', 'Add Sub Department Name');

      return;
    }

    let model = {
      'ActivityDesc': subdepartment,
      'DepartmentTypeId': this.selectedDepartmentId
    };

    this.showLoader = true;
        this.statusUpdate.AddSubDepartment(model).subscribe(x => {
          if (x.ok == true) {
            if (x.body.success) {

              this.departmentTypeSelected = false;
              subdepartment = undefined;
              this.showSubModelActionRow = false; 

              this.showLoader = false;
              this.toastr.displaySuccessMessage('success', "Record Added Successfully");
              this.OnDepartmentChanged(this.selectedDepartmentId,this.departmentName);
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

  removeSubDepartment(item: any) {

    if (confirm("are you sure want to delete") == true) {
      this.showLoader = true;
      this.statusUpdate.RemoveSubDepartment(this.selectedDepartmentId,item.activityStatusId).subscribe(x => {
        if (x.ok == true) {
          if (x.body.success) {
            this.showLoader = false;
            this.toastr.displaySuccessMessage('success', "Record Deleted Successfully");
            this.OnDepartmentChanged(this.selectedDepartmentId,this.departmentName);
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
          this.toastr.displayErrorMessage('NMO', 'An Error Occured. remove sub department');
          this.showLoader = false;
        }
        else {
          this.toastr.displayErrorMessage('NMO', error.message);
          this.showLoader = false;
        }
      }); 
    }
    else {
      item.isSelcted = true;
    }
  }

  // GetAllDepartmentCategories() {
  //   this.referenceService.GetAllDepartmentCategories().subscribe(x => {
  //     if (x.ok == true) {
  //       if (x.body.success) {
  //         this.departmentCategoryList = x.body.data;
          
  //       } else {
  //         this.toastr.displayErrorMessage('NMO', x.body.message);
          
  //       }
  //     }
  //     else {
  //       this.toastr.displayErrorMessage('NMO', x.body.message);
        
  //     }

  //   }, (error) => {
  //     this.toastr.displayErrorMessage('NMO', error.message);
      
  //   });
  // }

  // GetAllmake () {
  //   this.referenceService.GetAllmake().subscribe(x => {
  //     if (x.ok == true) {
  //       this.vehicleMakeList = x.body;
  //       this.masterVehicleMakeList  = x.body;
        
  //     }
  //     else {
  //       this.toastr.displayErrorMessage('NMO', x.body.message);
        
  //     }

  //   }, (error) => {
  //     this.toastr.displayErrorMessage('NMO', error.message);
      
  //   });
  // }

  // searchMakeList(event: any)
  // {
  //   const val = event.target.value.toLowerCase();
  //   if(event.target.value.length <= 1)
  //   {
  //     this.vehicleMakeList = this.masterVehicleMakeList;
  //   }
  //   // filter our data
  //   const temp = this.vehicleMakeList.filter(function (d) {
  //     if(d.name != null && d.name != undefined && d.name != "") {
  //       return d.name.toLowerCase().indexOf(val) !== -1 || !val;
  //     }
  //     return;      
  //   });

  //   // update the rows
  //   this.vehicleMakeList = temp;
  //   // Whenever the filter changes, always go back to the first page
    
  // }

  // searchDepartmentTypeList(event: any)
  // {
  //   const val = event.target.value.toLowerCase();
  //   if(event.target.value.length <= 1)
  //   {
  //     this.vehicleModelList = this.masterVehicleModelList;
  //   }
  //   // filter our data
  //   const temp = this.vehicleModelList.filter(function (d) {
  //     return d.modelDesc.toLowerCase().indexOf(val) !== -1 || !val;
  //   });

  //   // update the rows
  //   this.vehicleModelList = temp;
  //   // Whenever the filter changes, always go back to the first page
    
  // }

  // GetAllDepartmentTypeByCategoryId(categoryId: any, categoryDescription: any)
  // {
   
  //   this.categoryId = categoryId;
  //   this.categoryDescription =  categoryDescription
  //   this.referenceService.GetAllDepartmentTypeByCategoryId(categoryId).subscribe(x => {
  //     this.departmentTypeList = x.body;
  //     // this.selectedMake = makeName
  //     this.departmentTypeSelected = true;
  //     // this.masterVehicleModelList =x.body;
  //   });
    
  // }
  

  // getModels(makeId:number,makeName:any)
  // {
  //   // this.selectedMakeId = makeId;
  //   // this.referenceService.GetAllModelsByMakeId(makeId).subscribe(x => {
  //   //   this.vehicleModelList = x.body;
  //   //   this.selectedMake = makeName
  //   //   this.modelSelected = true;
  //   //   this.masterVehicleModelList =x.body;
  //   // });

  // }

  // AddNewMake()
  // {
  
  //   this.showMakeActionRow = true;
  // }

  // AddNewModel()
  // {
  //   this.showModelActionRow = true;
   
  // }

  // cancelMakeAdd()
  // {
  //   this.showMakeActionRow = false;
  // }

  // canceldepartmentTypeAdd()
  // {
  //   this.showModelActionRow = false;
  // }

  // submitNewMake(make:any)
  // {
  //   if(make==undefined || make == "" || make == null) {
  //     this.toastr.displayErrorMessage('NMO', "Please Enter Make");
  //     return; 
  //   }
  //   let _make = new Make();
  //   _make.name = make;
  //   _make.logo = "";

    
  //   this.referenceService.UpdateMake(_make).subscribe(x => {
  //     if (x.ok == true) {
  //       if(x.body.success) {
  //         this.toastr.displaySuccessMessage('success', 'make added successfully');
  //         this.vehicleMakeList = x.body;
          
  //         this.cancelMakeAdd();
  //         this.GetAllmake();
  //       }
  //       else {
  //         this.toastr.displayErrorMessage('NMO', x.body.message);
  //       }
  //     }
  //     else {
  //       this.toastr.displayErrorMessage('NMO', x.body.message);
        
  //     }

  //   }, (error) => {
  //     this.toastr.displayErrorMessage('NMO', error.message);
  //     console.log(JSON.stringify(error));
      
  //   });
  // }

  // SubmitNewDepartment(type:any)
  // {
  //   if(type==undefined || type == "" || type == null) {
  //     this.toastr.displayErrorMessage('NMO', "Please Enter Department");
  //     return; 
  //   }

  //   this.departmentTypeModel = new DepartmentType();
  //   this.departmentTypeModel.categoryId = this.categoryId;
  //   this.departmentTypeModel.type = type;

  //   this.referenceService.CreateDepartmentType(this.departmentTypeModel).subscribe(x => {
  //     if (x.ok == true) {
  //       if (x.body.success) {
  //         this.toastr.displaySuccessMessage('success', "Record Added Successfully");          
  //         this.canceldepartmentTypeAdd();
  //         this.GetAllDepartmentTypeByCategoryId(this.categoryId,this.categoryDescription);
  //       } else {
  //         this.toastr.displayErrorMessage('NMO', x.body.message);
          
  //       }
  //     }
  //     else {
  //       this.toastr.displayErrorMessage('NMO', x.body.message);
        
  //     }

  //   }, (error) => {
  //     this.toastr.displayErrorMessage('NMO', error.error);
      
  //   });


    // let _model = new ModelType();
    // _model.makeId = this.selectedMakeId;
    // _model.modelDesc = model;

    // this.referenceService.UpdateModel(_model).subscribe(x => {
    //   if (x.ok == true) {
    //     if(x.body.success) {
    //       this.toastr.displaySuccessMessage('success', 'model added successfully');
    //     //this.vehicleModelList = x.body;
        
    //     // this.cancelModelAdd();
    //     // this.getModels(this.selectedMakeId,this.selectedMake);
    //     }
    //     else {
    //       this.toastr.displayErrorMessage('NMO', x.body.message);
    //     }
    //   }
    //   else {
    //     this.toastr.displayErrorMessage('NMO', x.body.message);
        
    //   }

    // }, (error) => {
    //   this.toastr.displayErrorMessage('NMO', error.message);
      
    // });

  //}
 
}
