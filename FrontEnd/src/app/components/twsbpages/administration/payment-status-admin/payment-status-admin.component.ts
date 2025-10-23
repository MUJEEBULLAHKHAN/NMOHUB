import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../../../../shared/services/twsbservices/workshop.service';
import { AppComponent } from '../../../../app.component';
import { UserRM } from '../../../../models/user';
import { Workshops } from '../../../../models/Workshops';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { PaymentStatus } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-payment-status-admin',
  standalone: false,
  // imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './payment-status-admin.component.html',
  styleUrl: './payment-status-admin.component.scss'
})
export class PaymentStatusAdminComponent {

  user = new UserRM();
  paymentStatus = new PaymentStatus();
  paymentStatusList: PaymentStatus[] = [];
  //vehicleModelList:ModelType[]=[];
  masterPaymentStatusList = [];
  showPaymentStatusActionRow: boolean = false;

  //workshop: any;

  constructor(private route: ActivatedRoute, public router: Router, public workshopService: WorkshopService,
    public appComponent: AppComponent, public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.GetAllPaymentStatus();
  }

  GetAllPaymentStatus() {
    this.referenceService.GetAllPaymentStatus().subscribe(x => {
      if (x.ok == true) {
        this.paymentStatusList = x.body;
        this.masterPaymentStatusList = x.body;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }
    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }

  searchPaymentStatusList(event: any) {
    const val = event.target.value.toLowerCase();
    if (event.target.value.length <= 1) {
      this.paymentStatusList = this.masterPaymentStatusList;
    }
    // filter our data
    const temp = this.paymentStatusList.filter(function (d) {
      if (d.status != null && d.status != undefined && d.status != "") {
        return d.status.toLowerCase().indexOf(val) !== -1 || !val;
      }
      return;
    });

    // update the rows
    this.paymentStatusList = temp;
    // Whenever the filter changes, always go back to the first page

  }

  AddNewPaymentStatus() {
    this.paymentStatus = new PaymentStatus();
    this.paymentStatus.id = 0;
    this.showPaymentStatusActionRow = true;
  }

  cancelPaymentStatusAdd() {
    this.showPaymentStatusActionRow = false;
    this.paymentStatus = new PaymentStatus();
    this.paymentStatus.id = 0;
  }


  submitPaymentStatus(status: any) {
    if (status == undefined || status == "" || status == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter Status");
      return;
    }
    let _PaymentStatus = new PaymentStatus();
    _PaymentStatus.status = status;

    this.referenceService.CreatePaymentStatus(_PaymentStatus).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'Project Type added successfully');
        this.cancelPaymentStatusAdd();
        this.GetAllPaymentStatus();

        this.paymentStatus = new PaymentStatus();
        this.paymentStatus.id = 0;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      console.log(JSON.stringify(error));

    });
  }

  Edit(item: any) {
     this.paymentStatus = item;
    this.showPaymentStatusActionRow = true;
  }


  updatePaymentStatus(PaymentStatus: any) {
    if (PaymentStatus == undefined || PaymentStatus == "" || PaymentStatus == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter Project Status");
      return;
    }
    

    this.referenceService.UpdatePaymentStatus(this.paymentStatus.id, this.paymentStatus).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', 'City added successfully');
        this.cancelPaymentStatusAdd();
        this.GetAllPaymentStatus();

        this.paymentStatus = new PaymentStatus();
        this.paymentStatus.id = 0;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      console.log(JSON.stringify(error));

    });
  }

}
