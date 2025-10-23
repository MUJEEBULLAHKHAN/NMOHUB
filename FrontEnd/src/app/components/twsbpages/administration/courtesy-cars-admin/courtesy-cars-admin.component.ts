import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { WorkShopCourtesyCars } from '../../../../models/WorkShopCourtesyCars';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { WorkshopCourtesyCarsService } from '../../../../shared/services/twsbservices/workshop-courtesy-cars.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Make, ModelType } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-courtesy-cars-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './courtesy-cars-admin.component.html',
  styleUrl: './courtesy-cars-admin.component.scss'
})
export class CourtesyCarsAdminComponent {

  workShopCourtesyCarsModel = new WorkShopCourtesyCars();
  courtesyCarsList!: WorkShopCourtesyCars[];
  vehicleMakeList: Make[] = [];
  vehicleModelList: ModelType[] = [];
  vehicleMake: any;
  temps: any;

  @ViewChild('modalAddCourtesyCarsPopUp') modalAddCourtesyCarsPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalUpdateUserPopUp') modalUpdateUserPopUp: TemplateRef<any> | undefined;



  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal, public referenceService: ReferenceService,
    public workshopCourtesyCarsService: WorkshopCourtesyCarsService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.GetAllWorkShopCourtesyCars();
    this.GetAllmake();
  }


  GetAllWorkShopCourtesyCars() {
    this.workshopCourtesyCarsService.GetAllWorkShopCourtesyCars().subscribe(x => {
      if (x.ok == true) {
        this.courtesyCarsList = x.body;
        this.temps = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetAllmake() {
    this.referenceService.GetAllmake().subscribe(x => {
      if (x.ok == true) {
        this.vehicleMakeList = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  getModels(makeId: any) {
    const name = this.vehicleMakeList.filter(x => x.makeId == makeId)[0].name;
    this.workShopCourtesyCarsModel.vehicleMake = name;
    this.referenceService.GetAllModelsByMakeId(makeId).subscribe(x => {
      this.vehicleModelList = x.body;
    });
  }

  AddCourtesyCarsPopUp() {
    this.workShopCourtesyCarsModel = new WorkShopCourtesyCars();
    this.workShopCourtesyCarsModel.courtesyCarId = 0;
    this.vehicleMake = undefined;
    this.modalService.open(this.modalAddCourtesyCarsPopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.workShopCourtesyCarsModel.vehicleMake == null || this.workShopCourtesyCarsModel.vehicleMake == "" || this.workShopCourtesyCarsModel.vehicleMake == undefined ||
      this.workShopCourtesyCarsModel.vehicleModel == null || this.workShopCourtesyCarsModel.vehicleModel == "" || this.workShopCourtesyCarsModel.vehicleModel == undefined ||
      this.workShopCourtesyCarsModel.registrationNumber == null || this.workShopCourtesyCarsModel.registrationNumber == "" || this.workShopCourtesyCarsModel.registrationNumber == undefined ||
      this.workShopCourtesyCarsModel.mileage == null || this.workShopCourtesyCarsModel.mileage == "" || this.workShopCourtesyCarsModel.mileage == undefined ||
      this.workShopCourtesyCarsModel.status == null || this.workShopCourtesyCarsModel.status == "" || this.workShopCourtesyCarsModel.status == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    if (this.workShopCourtesyCarsModel.status == "Available") {
      this.workShopCourtesyCarsModel.isAvailable = true;
    }
    else {
      this.workShopCourtesyCarsModel.isAvailable = false;
    }
    this.workshopCourtesyCarsService.AddWorkShopCourtesyCars(this.workShopCourtesyCarsModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Added Successfully");
        this.modalService.dismissAll();
        
        this.GetAllWorkShopCourtesyCars();
        this.workShopCourtesyCarsModel = new WorkShopCourtesyCars();
        this.vehicleMake = undefined;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', error.error);
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
        
      }
    });
  }

  EditWorkShopCourtesyCars(item: any) {
    this.workShopCourtesyCarsModel = new WorkShopCourtesyCars();
    this.modalService.open(this.modalAddCourtesyCarsPopUp, { backdrop: 'static' });


    const makeId = this.vehicleMakeList.filter(x => x.name == item.vehicleMake)[0].makeId;
    
    this.referenceService.GetAllModelsByMakeId(makeId).subscribe(x => {
      this.vehicleModelList = x.body;
    });

    this.vehicleMake = makeId;

    this.workShopCourtesyCarsModel = item;

  }

  UpdateWorkShopCourtesyCars() {
    if (this.workShopCourtesyCarsModel.vehicleMake == null || this.workShopCourtesyCarsModel.vehicleMake == "" || this.workShopCourtesyCarsModel.vehicleMake == undefined ||
      this.workShopCourtesyCarsModel.vehicleModel == null || this.workShopCourtesyCarsModel.vehicleModel == "" || this.workShopCourtesyCarsModel.vehicleModel == undefined ||
      this.workShopCourtesyCarsModel.registrationNumber == null || this.workShopCourtesyCarsModel.registrationNumber == "" || this.workShopCourtesyCarsModel.registrationNumber == undefined ||
      this.workShopCourtesyCarsModel.mileage == null || this.workShopCourtesyCarsModel.mileage == "" || this.workShopCourtesyCarsModel.mileage == undefined ||
      this.workShopCourtesyCarsModel.status == null || this.workShopCourtesyCarsModel.status == "" || this.workShopCourtesyCarsModel.status == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }
    if (this.workShopCourtesyCarsModel.status == "Available") {
      this.workShopCourtesyCarsModel.isAvailable = true;
    }
    else {
      this.workShopCourtesyCarsModel.isAvailable = false;
    }
    this.workshopCourtesyCarsService.UpdateWorkShopCourtesyCars(this.workShopCourtesyCarsModel.courtesyCarId, this.workShopCourtesyCarsModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();
        

        this.workShopCourtesyCarsModel = new WorkShopCourtesyCars();
        this.workShopCourtesyCarsModel.courtesyCarId = 0;
        this.GetAllWorkShopCourtesyCars();

      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', error.error);
      }
      else {
        this.toastr.displayErrorMessage('NMO', error.message);
      }
      
    });
  }

  RemoveCourtesyCars(courtesyCarId: number) {

    this.workshopCourtesyCarsService.RemoveCourtesyCars(courtesyCarId).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success == true) {
          
          this.GetAllWorkShopCourtesyCars();
        } else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      if (error.status == 400) {
        this.toastr.displayErrorMessage('NMO', error.error);
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
      if (d.vehicleMake != null && d.vehicleMake != undefined && d.vehicleMake != null
      ) {
        return d.vehicleMake.toLowerCase().indexOf(val) !== -1 || !val ||
          d.vehicleModel.toLowerCase().indexOf(val) !== -1 || !val ||
          d.registrationNumber.toLowerCase().indexOf(val) !== -1 || !val ||
          d.mileage.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.courtesyCarsList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

  uploadCSIImage(event: any) {
    let reader = new FileReader();

    if (event.target.files.length <= 0 || event.target.files.length > 1) {
      this.toastr.displayErrorMessage('NMO', 'Minimum of 1 file to be uploaded');
      return
    }
    else {
      let file: File = event.target.files[0];

      let img = new Image();

      img.src = window.URL.createObjectURL(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        setTimeout(() => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;

          window.URL.revokeObjectURL(img.src);
          console.log(width + '*' + height);
          var imgURL = String(reader.result);
          //this.imageUploadResult = "Valid Image Dimension";
          this.workShopCourtesyCarsModel.image = imgURL;
        }, 2000);
      };
    }

    // after here 'file' can be accessed and used for further process
  }
}
