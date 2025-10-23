import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { NMOService } from '../../../../shared/services/new.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExpertService, AreaOfExpertise, AreaOfExpertiseModel, ForeignPackage } from '../../../../shared/services/twsbservices/expert.service';
import { ForeignEntrepreneurService } from '../../../../shared/services/twsbservices/ForeignEntrepreneur.service';


@Component({
  selector: 'app-foreign-service-package-admin',
  templateUrl: './foreign-service-package-admin.component.html',
  styleUrls: ['./foreign-service-package-admin.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  providers: [DisplaymessageComponent]
})
export class ForeignServicePackageAdminComponent implements OnInit, OnDestroy {

  closedOfficeList: any[] = [];
  selectedForeignPackage: any = {};
  showLoader = false;
  foreignPackages: ForeignPackage[] = [];
  foreignPackageModel: any = {};


  @ViewChild('modalForeignPackage') modalForeignPackage!: TemplateRef<any>;

  constructor(
    private nmoService: NMOService,
    private modalService: NgbModal,
    private toastr: DisplaymessageComponent,
    private expertService: ExpertService,
    private foreignEntrepreneurService: ForeignEntrepreneurService
  ) { }

  ngOnInit(): void {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.getForeignPackages();
  }

  ngOnDestroy(): void {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }

  getForeignPackages() {
    this.showLoader = true;
    this.foreignEntrepreneurService.GetAllForeignPackages().subscribe({
      next: (res: any) => {
        this.showLoader = false;
        this.foreignPackages = res.body.data || [];
      },
      error: (err: any) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', err.message);
      }
    });
  }

  openModal() {
    this.foreignPackageModel = new AreaOfExpertiseModel(); // reset for Add
    this.foreignPackageModel.id = 0;
    this.modalService.open(this.modalForeignPackage, { backdrop: 'static' });
  }

  editClosedOffice(item: any) {
    this.foreignPackageModel = item;
    this.modalService.open(this.modalForeignPackage, { backdrop: 'static' });
  }

  Save() {

    if (this.foreignPackageModel.packageName == null || this.foreignPackageModel.packageName == "" ||
      this.foreignPackageModel.packageName == undefined) {
      this.toastr.displayErrorMessage('NMO', "Please Enter Package Name");
      return;
    }

    this.showLoader = true;
    this.foreignEntrepreneurService.CreateForeignPackage(this.foreignPackageModel).subscribe({
      next: (res) => {
        if (res.body.success) {
          this.foreignPackageModel = new AreaOfExpertiseModel(); // reset for Add
          this.foreignPackageModel.id = 0;
          this.showLoader = false;
          this.toastr.displaySuccessMessage('Success', 'Record updated successfully');
          this.modalService.dismissAll();
          this.getForeignPackages();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body.message);
          this.showLoader = false;
        }
      },
      error: (err) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO:', err.error.message);
      }
    });
  }

  UpdateForeignPackage() {
    if (this.foreignPackageModel.packageName == null || this.foreignPackageModel.packageName == "" ||
      this.foreignPackageModel.packageName == undefined) {
      this.toastr.displayErrorMessage('NMO', "Please Enter Package Name");
      return;
    }


    this.showLoader = true;
    this.foreignEntrepreneurService.UpdateForeignPackage(this.foreignPackageModel.id, this.foreignPackageModel).subscribe({
      next: (res) => {
        if (res.body.success) {
          this.foreignPackageModel = new AreaOfExpertiseModel(); // reset for Add
          this.foreignPackageModel.id = 0;
          this.showLoader = false;
          this.toastr.displaySuccessMessage('Success', 'Record updated successfully');
          this.modalService.dismissAll();
          this.getForeignPackages();
        } else {
          this.toastr.displayErrorMessage('NMO', res.body.message);
          this.showLoader = false;
        }
      },
      error: (err) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO:', err.error.message);
      }
    });
  }
}
