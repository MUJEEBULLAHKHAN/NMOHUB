import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { NMOService } from '../../../../shared/services/new.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExpertService, AreaOfExpertise, AreaOfExpertiseModel } from '../../../../shared/services/twsbservices/expert.service';


@Component({
  selector: 'app-areas-of-expertise-admin',
  templateUrl: './areas-of-expertise-admin.component.html',
  styleUrls: ['./areas-of-expertise-admin.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  providers: [DisplaymessageComponent]
})
export class AreasOfExpertiseAdminComponent implements OnInit, OnDestroy {

  closedOfficeList: any[] = [];
  selectedExpertise: any = {};
  showLoader = false;
  areasOfExpertise: AreaOfExpertise[] = [];
  areasOfExpertiseModel: any = {};

  @ViewChild('modalAreasOfExpertise') modalAreasOfExpertise!: TemplateRef<any>;

  constructor(
    private nmoService: NMOService,
    private modalService: NgbModal,
    private toastr: DisplaymessageComponent,
    private expertService: ExpertService
  ) { }

  ngOnInit(): void {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.getAreasOfExpertise();
  }

  ngOnDestroy(): void {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }

  getAreasOfExpertise() {
    this.showLoader = true;
    this.expertService.getAreasOfExpertise().subscribe({
      next: (res: any) => {
        this.showLoader = false;
        this.areasOfExpertise = res || [];
      },
      error: (err: any) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', err.message);
      }
    });
  }

  openModal() {
    this.areasOfExpertiseModel = new AreaOfExpertiseModel(); // reset for Add
    this.areasOfExpertiseModel.areaOfExpertiseID = 0;
    this.modalService.open(this.modalAreasOfExpertise, { backdrop: 'static' });
  }

  editClosedOffice(item: any) {
    this.areasOfExpertiseModel = item;
    this.modalService.open(this.modalAreasOfExpertise, { backdrop: 'static' });
  }

  Save() {
    this.showLoader = true;
    this.expertService.CreateExpertise(this.areasOfExpertiseModel).subscribe({
      next: (res) => {
        if (res.body.success) {
          this.areasOfExpertiseModel = new AreaOfExpertiseModel(); // reset for Add
          this.areasOfExpertiseModel.areaOfExpertiseID = 0;
          this.showLoader = false;
          this.toastr.displaySuccessMessage('Success', 'Record updated successfully');
          this.modalService.dismissAll();
          this.getAreasOfExpertise();
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

  updateClosedOffice() {
    this.showLoader = true;
    this.expertService.UpdateExpertise(this.areasOfExpertiseModel).subscribe({
        next: (res) => {
        if (res.body.success) {
          this.areasOfExpertiseModel = new AreaOfExpertiseModel(); // reset for Add
          this.areasOfExpertiseModel.areaOfExpertiseID = 0;
          this.showLoader = false;
          this.toastr.displaySuccessMessage('Success', 'Record updated successfully');
          this.modalService.dismissAll();
          this.getAreasOfExpertise();
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
