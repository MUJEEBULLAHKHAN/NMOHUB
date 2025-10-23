import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { PackageService } from '../../../../shared/services/twsbservices/package.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Package, Service } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-package-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './package-admin.component.html',
  styleUrl: './package-admin.component.scss'
})
export class PackageAdminComponent {

  packageModel = new Package();
  packageList!: Package[];
  serviceList!: Service[];
  showLoader = false;
  temps: any;
  showMessageTypeActionRow: boolean = false;


  @ViewChild('modalPackagePopUp') modalPackagePopUp: TemplateRef<any> | undefined;

  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public packageService: PackageService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.GetAllPackage();
    //this.GetAllService();
  }


  GetAllPackage() {

    this.showLoader = true;
    this.packageService.GetAllPackage().subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.packageList = x.body.data;
        this.temps = x.body.data;
      }
      else {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }

    }, (error) => {
      this.showLoader = false;
      this.toastr.displayErrorMessage('NMO', error.message);
    });
  }


  // GetAllService() {
  //   this.showLoader = true;
  //   this.packageService.GetAllService().subscribe(x => {
  //     if (x.ok == true) {
  //       this.showLoader = false;
  //       this.serviceList = x.body.data;
  //       this.serviceList = this.serviceList.filter(x=> x.hasPackages);
  //       this.temps = x.body.data;
  //     }
  //     else {
  //       this.showLoader = false;
  //       this.toastr.displayErrorMessage('NMO', x.body.message);

  //     }

  //   }, (error) => {
  //     this.showLoader = false;
  //     this.toastr.displayErrorMessage('NMO', error.message);

  //   });
  // }


  PackagePopUp() {
    this.packageModel = new Package();
    this.packageModel.packageId = 0;
    this.modalService.open(this.modalPackagePopUp, { backdrop: 'static' });
  }

Submit() {
  if (!this.packageModel.name || !this.packageModel.price) {
    this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
    return;
  }

  // set logged in user
  const user = JSON.parse(localStorage.getItem('userinfo') || '{}');
  this.packageModel.updatedBy = user?.userDetails?.userId || 0;

  this.showLoader = true;
  this.packageService.CreatePackage(this.packageModel).subscribe(
    x => {
      if (x.ok) {
        this.showLoader = false;
        this.toastr.displaySuccessMessage('success', "Record Added Successfully");
        this.packageModel = new Package();
        this.modalService.dismissAll();
        this.GetAllPackage();
      } else {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }
    },
    (error) => {
      this.showLoader = false;
      this.toastr.displayErrorMessage('NMO', error.error);
    }
  );
}

  EditPackage(item: Package) {
  this.showLoader = true;

  this.packageService.GetPackageById(item?.packageId).subscribe(
    res => {
      this.showLoader = false;
      if (res.ok) {
        this.packageModel = { ...res.body.data }; 
        this.modalService.open(this.modalPackagePopUp, { backdrop: 'static' });
      } else {
        this.toastr.displayErrorMessage('NMO', res.body.message);
      }
    },
    error => {
      this.showLoader = false;
      this.toastr.displayErrorMessage('NMO', error.message);
    }
  );
}



  UpdatePackage() {
    if (this.packageModel.name == null || this.packageModel.name == "" || this.packageModel.name == undefined ||
      this.packageModel.price == null || this.packageModel.price <= 0 || this.packageModel.price == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.showLoader = true;
    this.packageService.UpdatePackage(this.packageModel.packageId, this.packageModel).subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();

        this.packageModel = new Package();
        this.packageModel.packageId = 0;
        this.GetAllPackage();
      }
      else {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }
    }, (error) => {
      this.showLoader = false;
      this.toastr.displayErrorMessage('NMO', error.error);
    });
  }

  updateFilter(event: any) {

    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temps.filter(function (d: any) {
      if (d.name != null && d.name != undefined && d.name != null
        && d.description != null && d.description != undefined && d.description != null
      ) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val ||
          d.description.toLowerCase().indexOf(val) !== -1 || !val;
      } else {
        // Handle the case where d.emailAddress or d.firstNames is null or undefined
        return false; // Or return a default value based on your requirements
      }
    });
    // update the rows
    this.packageList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

}
