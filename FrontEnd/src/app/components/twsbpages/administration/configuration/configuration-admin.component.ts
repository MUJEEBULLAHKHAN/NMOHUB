import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../../../../shared/services/twsbservices/workshop.service';
import { AppComponent } from '../../../../app.component';
import { UserRM } from '../../../../models/user';
import { Workshops } from '../../../../models/Workshops';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { City } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';

@Component({
  selector: 'app-configuration-admin',
  standalone: false,
  // imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './configuration-admin.component.html',
  styleUrl: './configuration-admin.component.scss'
})
export class ConfigurationAdminComponent {

  oTPFuction: any;
  showLoader = false;
  user = new UserRM();
  city = new City();
  cityList: City[] = [];
  //vehicleModelList:ModelType[]=[];
  masterCityList = [];
  //masterVehicleModelList=[];
  citySelected: boolean = false;
  selectedCity: any;
  selectedCityId!: number;
  showCityActionRow: boolean = false;

  //workshop: any;

  constructor(private route: ActivatedRoute, public router: Router, public workshopService: WorkshopService,
    public appComponent: AppComponent, public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('userdetails') as string)

  }


  UpdateConfiguaration(value: any) {
    this.showLoader = true;

    let model = {
      "configurationId":1,
      "name": "OTP Fuction To Show",
      "value": value
    }

    this.referenceService.UpdateConfigure(1, model).subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.toastr.displaySuccessMessage('success', 'Update successfully');
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false;
      }

    }, (error) => {
      this.showLoader = false;
      this.toastr.displayErrorMessage('NMO', error.message);
      console.log(JSON.stringify(error));

    });
  }

}
