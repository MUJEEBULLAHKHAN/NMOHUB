import { Component, OnInit, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkshopService } from '../../../../shared/services/twsbservices/workshop.service';
import { AppComponent } from '../../../../app.component';
import { UserRM } from '../../../../models/user';
import { Workshops, WorkshopBankAccounts } from '../../../../models/Workshops';
// import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ReferenceService } from '../../../../shared/services/twsbservices/reference.service';
import { Country, Currency } from '../../../../models/Reference';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-workshop-admin',
  standalone: false,
  providers: [DisplaymessageComponent],
  templateUrl: './workshop-admin.component.html',
  styleUrl: './workshop-admin.component.scss'
})
export class WorkshopAdminComponent {
  //@ViewChild(DatatableComponent) table: DatatableComponent | any;
  //users!: UserRM[];
  showLoader:boolean | undefined;
  user = new UserRM();
  workshop = new Workshops();
  workshopBankAccounts = new WorkshopBankAccounts();
  email: any;
  workshopId: number = 0;
  workshops!: Workshops[];
  country!: Country[];
  currency!: Currency[];
  temp: any;
  workshopUserList!: UserRM[];
  workshopName!: string;
  tabs: any = {
    workshopTab: true,
    bankDetailsTab: false,
  };

  @ViewChild('modalAddWorkshopPopUp') modalAddWorkshopPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalUpdateWorkshopPopUp') modalUpdateWorkshopPopUp: TemplateRef<any> | undefined;
  @ViewChild('modalUserPopUp') modalUserPopUp: TemplateRef<any> | undefined;

  constructor(public router: Router,
    public workshopService: WorkshopService,
    public appComponent: AppComponent,
    private modalService: NgbModal,
    public referenceService: ReferenceService,
    private toastr: DisplaymessageComponent,) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('userdetails') as string)

    this.GetAllWorkshops();
    this.GetAllCurrency();
    this.GetAllCountry();
  }
  showTab(e: string) {
    for (const key in this.tabs) {
      if (key == e) {
        this.tabs[key] = true;
      } else {
        this.tabs[key] = false;
      }
    }
  }

  GetAllCurrency() {
    
    this.referenceService.GetAllCurrency().subscribe(x => {
      if (x.ok == true) {
        this.currency = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetAllCountry() {
    
    this.referenceService.GetAllCountry().subscribe(x => {
      if (x.ok == true) {
        this.country = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      
    });
  }

  GetAllWorkshops() {
    
    this.workshopService.GetAllWorkshops().subscribe(x => {
      if (x.ok == true) {
        this.workshops = x.body;
        this.temp = x.body;
        
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }


  AddWorkshopPopUp() {
    this.workshop = new Workshops();
    this.workshopBankAccounts = new WorkshopBankAccounts();
    this.workshopId = 0;
    this.modalService.open(this.modalAddWorkshopPopUp, { backdrop: 'static', size: 'lg' });
    // let element = document.getElementById("workshopTab") as HTMLElement;
    // if(element !=null) {
    //   element.style.display = "none";
    // }
  }

  RegisterWorkshop() {
    if (this.workshop.workshopName == null || this.workshop.workshopName == "" || this.workshop.workshopName == undefined ||
      this.workshop.vatNumber == null || this.workshop.vatNumber == "" || this.workshop.vatNumber == undefined ||
      this.workshop.emailAddress == null || this.workshop.emailAddress == "" || this.workshop.emailAddress == undefined ||
      this.workshop.registrationNumber == null || this.workshop.registrationNumber == "" || this.workshop.registrationNumber == undefined ||
      this.workshop.abbreviation == null || this.workshop.abbreviation == "" || this.workshop.abbreviation == undefined ||
      this.workshop.countryId == null || this.workshop.countryId <= 0 || this.workshop.countryId == undefined ||
      this.workshop.currencyId == null || this.workshop.currencyId <= 0 || this.workshop.currencyId == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Workshop Required Field Is Mandatory");
      return;
    }

    this.workshop.workshopBankAccounts = this.workshopBankAccounts;
    this.showLoader = true;
    this.workshopService.RegisterWorkshop(this.workshop).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Workshop Added Successfully");
          this.modalService.dismissAll();
          this.showLoader = false;
          this.workshop = new Workshops();
          this.GetAllWorkshops();
        }
        else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          this.showLoader = false;
        }

      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false;
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);
      this.showLoader = false;
    });
  }

  EditWorkshop(item: any) {
    
    this.workshopService.GetWorkshopById(item.workshopId).subscribe(x => {
      if (x.ok == true) {
        this.workshopId = item.workshopId;
        
        this.workshop = x.body;
        if (x.body.workshopBankAccounts == null || x.body.workshopBankAccounts == undefined) {
          this.workshopBankAccounts = new WorkshopBankAccounts();
        }
        else {
          this.workshopBankAccounts = x.body.workshopBankAccounts;
        }

        this.modalService.open(this.modalAddWorkshopPopUp, { backdrop: 'static', size: 'lg' });

        this.showTab('workshopTab');
        let element = document.getElementById("workshopTab") as HTMLElement;
        let paragraphs = element.getElementsByTagName('a');

        if (paragraphs.length > 0) {
          var bankElement = document.getElementById(paragraphs[0].id) as HTMLElement;
          bankElement.click();
        }
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }

  UpdateWorkshop() {
    if (this.workshop.workshopName == null || this.workshop.workshopName == "" || this.workshop.workshopName == undefined ||
      this.workshop.vatNumber == null || this.workshop.vatNumber == "" || this.workshop.vatNumber == undefined ||
      this.workshop.emailAddress == null || this.workshop.emailAddress == "" || this.workshop.emailAddress == undefined ||
      this.workshop.registrationNumber == null || this.workshop.registrationNumber == "" || this.workshop.registrationNumber == undefined ||
      this.workshop.abbreviation == null || this.workshop.abbreviation == "" || this.workshop.abbreviation == undefined ||
      this.workshop.countryId == null || this.workshop.countryId <= 0 || this.workshop.countryId == undefined ||
      this.workshop.currencyId == null || this.workshop.currencyId <= 0 || this.workshop.currencyId == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Required Field Is Mandatory");
      return;
    }

    this.workshop.workshopBankAccounts = this.workshopBankAccounts;
    this.showLoader = true;
    this.workshopService.UpdateWorkshop(this.workshopId, this.workshop).subscribe(x => {
      if (x.ok == true) {
        if (x.body.success) {
          this.toastr.displaySuccessMessage('success', "Workshop Updated Successfully");
          this.workshopId = 0;
          this.modalService.dismissAll();
          this.showLoader = false;
          this.GetAllWorkshops();
        }
        else {
          this.toastr.displayErrorMessage('NMO', x.body.message);
          this.showLoader = false;
        }

      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        this.showLoader = false;
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      this.showLoader = false;
    });
  }

  importWorkshopImageFile(event: any) {
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
          this.workshop.workshopLogo = imgURL;
        }, 2000);
      };
    }

    // after here 'file' can be accessed and used for further process
  }

  Next() {
    if (this.workshop.workshopName == null || this.workshop.workshopName == "" || this.workshop.workshopName == undefined ||
      this.workshop.vatNumber == null || this.workshop.vatNumber == "" || this.workshop.vatNumber == undefined ||
      this.workshop.emailAddress == null || this.workshop.emailAddress == "" || this.workshop.emailAddress == undefined ||
      this.workshop.registrationNumber == null || this.workshop.registrationNumber == "" || this.workshop.registrationNumber == undefined ||
      this.workshop.abbreviation == null || this.workshop.abbreviation == "" || this.workshop.abbreviation == undefined ||
      this.workshop.countryId == null || this.workshop.countryId <= 0 || this.workshop.countryId == undefined ||
      this.workshop.currencyId == null || this.workshop.currencyId <= 0 || this.workshop.currencyId == undefined
    ) {
      this.toastr.displayErrorMessage('NMO', "Workshop Required Field Is Mandatory");
      return;
    }
    else {
      this.showTab('bankDetailsTab');
      let element = document.getElementById("bankDetailsTab") as HTMLElement;
      let paragraphs = element.getElementsByTagName('a');

      if (paragraphs.length > 0) {
        var bankElement = document.getElementById(paragraphs[0].id) as HTMLElement;
        bankElement.click();
      }
    }
  }

  GetUserByWorkshopId(workshopId: number, workshopName: string) {
    this.workshopName = workshopName;
    
    this.workshopService.GetUsersByWorkshopId(workshopId).subscribe(x => {
      if (x.ok == true) {
        
        this.workshopUserList = x.body.data;
        this.modalService.open(this.modalUserPopUp, { backdrop: 'static', size: 'lg' });
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
        
      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.error);
      
    });
  }
}
