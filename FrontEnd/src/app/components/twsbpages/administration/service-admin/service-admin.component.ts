import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { ServiceApi } from '../../../../shared/services/twsbservices/service.service';
import { el } from 'date-fns/locale';
import { NgbDateAdapter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Service } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-service-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './service-admin.component.html',
  styleUrl: './service-admin.component.scss'
})
export class ServiceAdminComponent {


  serviceModel = new Service();
  serviceList!: Service[];

  temps: any;
  showMessageTypeActionRow: boolean = false;


  @ViewChild('modalServicePopUp') modalServicePopUp: TemplateRef<any> | undefined;




  constructor(private route: ActivatedRoute, public router: Router,
    public appComponent: AppComponent, private modalService: NgbModal,
    public service: ServiceApi,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {
    this.GetAllService();
  }


  GetAllService() {

    this.service.GetAllService().subscribe(x => {
      if (x.ok == true) {
        this.serviceList = x.body.data;
        this.temps = x.body.data;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }


  ServicePopUp() {
    this.serviceModel = new Service();
    this.serviceModel.id = 0;
    this.modalService.open(this.modalServicePopUp, { backdrop: 'static' });
  }

  Submit() {
    if (this.serviceModel.name == null || this.serviceModel.name == "" || this.serviceModel.name == undefined ||
      this.serviceModel.description == null || this.serviceModel.description == "" || this.serviceModel.description == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.service.CreateService(this.serviceModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Added Successfully");
          this.serviceModel = new Service();
          this.modalService.dismissAll();
          this.GetAllService();
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);

    });
  }

  EditService(item: any) {
    this.serviceModel = new Service();
    this.modalService.open(this.modalServicePopUp, { backdrop: 'static' });
    this.serviceModel = item;
  }

  UpdateService() {
    if (this.serviceModel.name == null || this.serviceModel.name == "" || this.serviceModel.name == undefined ||
      this.serviceModel.description == null || this.serviceModel.description == "" || this.serviceModel.description == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.service.UpdateService(this.serviceModel.id, this.serviceModel).subscribe(x => {
      if (x.ok == true) {
        this.toastr.displaySuccessMessage('success', "Record Updated Successfully");
        this.modalService.dismissAll();

        this.serviceModel = new Service();
        this.serviceModel.id = 0;
        this.GetAllService();
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
    this.serviceList = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;

  }

  // serviceByMessageType(MessageType: string) {

  //   this.service.serviceByMessageType(MessageType).subscribe(x => {
  //     if (x.ok == true) {
  //       if (x.body.success) {
  //         if (x.body.data != null) {
  //           this.serviceModel = x.body.data;
  //         }


  //       } else {
  //         this.toastr.displayErrorMessage('NMO', x.body.message);

  //       }
  //     }
  //     else {
  //       this.toastr.displayErrorMessage('NMO', x.body.message);

  //     }

  //   }, (error) => {
  //     if (error.status == 400) {
  //       this.toastr.displayErrorMessage('NMO', 'An Error Occured. Failed to get SMS template');
  //     }
  //     else {
  //       this.toastr.displayErrorMessage('NMO', error.message);
  //     }

  //   });
  // }


}
