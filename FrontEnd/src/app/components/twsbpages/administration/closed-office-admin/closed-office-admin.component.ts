import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { NMOService } from '../../../../shared/services/new.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-closed-office-admin',
  templateUrl: './closed-office-admin.component.html',
  styleUrls: ['./closed-office-admin.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  providers: [DisplaymessageComponent]
})
export class ClosedOfficeAdminComponent implements OnInit, OnDestroy {

  closedOfficeList: any[] = [];
  selectedClosedOffice: any = {};
  showLoader = false;

  @ViewChild('modalClosedOffice') modalClosedOffice!: TemplateRef<any>;

  constructor(
    private nmoService: NMOService,
    private modalService: NgbModal,
    private toastr: DisplaymessageComponent
  ) { }

  ngOnInit(): void {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    this.getAllClosedOffice();
  }

  ngOnDestroy(): void {
    document.querySelector('.single-page-header')?.classList.remove('d-none');
  }

  getAllClosedOffice() {
    this.showLoader = true;
    this.nmoService.GetAllClosedOffice().subscribe({
      next: (res: any) => {
        this.showLoader = false;
        if (res.ok) {
          this.closedOfficeList = res.body.data;
        } else {
          this.toastr.displayErrorMessage('NMO', res.body.message);
        }
      },
      error: (err: any) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', err.message);
      }
    });
  }

  editClosedOffice(item: any) {
    this.selectedClosedOffice = { ...item };
    this.modalService.open(this.modalClosedOffice, { backdrop: 'static' });
  }

  updateClosedOffice() {
    this.showLoader = true;
    this.nmoService.ClosedOfficeUpdate(this.selectedClosedOffice.closedOfficeId, this.selectedClosedOffice)
      .subscribe({
        next: (res: any) => {
          this.showLoader = false;
          if (res.ok) {
            this.toastr.displaySuccessMessage('Success', 'Record updated successfully');
            this.modalService.dismissAll();
            this.getAllClosedOffice();
          } else {
            this.toastr.displayErrorMessage('NMO', res.body.message);
          }
        },
        error: (err: any) => {
          this.showLoader = false;
          this.toastr.displayErrorMessage('NMO', err.message);
        }
      });
  }
}
