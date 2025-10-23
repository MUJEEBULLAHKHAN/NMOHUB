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
  selector: 'app-city-admin',
  standalone: false,
  // imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './city-admin.component.html',
  styleUrl: './city-admin.component.scss'
})
export class CityAdminComponent {

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
    this.GetAllCity();
  }

  GetAllCity() {
    this.showLoader = true;
    this.referenceService.GetAllCity().subscribe(x => {
      if (x.ok == true) {
        this.cityList = x.body;
        this.masterCityList = x.body;
        this.showLoader = false;
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false;
      }

    }, (error) => {
      this.showLoader = false;
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }

  searchCityList(event: any) {
    const val = event.target.value.toLowerCase();
    if (event.target.value.length <= 1) {
      this.cityList = this.masterCityList;
    }
    // filter our data
    const temp = this.cityList.filter(function (d) {
      if (d.name != null && d.name != undefined && d.name != "") {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
      return;
    });

    // update the rows
    this.cityList = temp;
    // Whenever the filter changes, always go back to the first page

  }

  AddNewCity() {
    this.city = new City();
    this.city.id = 0;
    this.showCityActionRow = true;
  }

  cancelCityAdd() {
    this.showCityActionRow = false;
    this.city = new City();
    this.city.id = 0;
  }


  submitCity(city: any) {
    if (city == undefined || city == "" || city == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter City");
      return;
    }
    let _make = new City();
    _make.name = city;
    this.showLoader = true;
    this.referenceService.CreateCity(_make).subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.toastr.displaySuccessMessage('success', 'City added successfully');
        this.cancelCityAdd();
        this.GetAllCity();

        this.city = new City();
        this.city.id = 0;
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

  Edit(item: any) {
    this.city = item;
    this.showCityActionRow = true;
  }


  updateCity(city: any) {
    if (city == undefined || city == "" || city == null) {
      this.toastr.displayErrorMessage('NMO', "Please Enter City");
      return;
    }
    let _make = new City();
    _make.name = city;
    this.showLoader = true;
    this.referenceService.UpdateCity(this.city.id, this.city).subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.toastr.displaySuccessMessage('success', 'City added successfully');
        this.cancelCityAdd();
        this.GetAllCity();

        this.city = new City();
        this.city.id = 0;
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
