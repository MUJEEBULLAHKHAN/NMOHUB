import { Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../../shared/models/authentication';
import { UserAuthService } from '../../../shared/services/twsbservices/user-auth.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { Service, Package, VOService } from '../../../models/Reference';
import { PackageService } from '../../../shared/services/twsbservices/package.service';
import { NMOService } from '../../../shared/services/new.service';


@Component({
  selector: 'app-package-info',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './package-info.component.html',
  styleUrl: './package-info.component.scss'
})
export class PackageInfoComponent implements OnInit, OnDestroy {
  authentication = new authentication();
  disabled = '';
  active: any;
  showLoader: boolean | undefined;
  showDetailsLoader: boolean | undefined;
  public loginForm!: FormGroup;
  public error: any = '';
  showPassword = false;
  toggleClass = "ri-eye-off-line";
  serviceList!: Service[];
  packageList!: Package[];
  selectedService: Service | null = null;
  isModalOpen = false;
  serviceModel!: VOService;
  package!: Package;
  public serviceRequestId: any = '';
  user: any;
  role: any;
  employee: any = {};

  public _userDetails: any;
  @ViewChild('modalServicePopUp') modalServicePopUp: TemplateRef<any> | undefined;

  constructor(
    public authservice: UserAuthService,
    private elementRef: ElementRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private toastr: DisplaymessageComponent,
    public service: ServiceApi,
    private modalService: NgbModal,
    public packageService: PackageService,
    private activeRoute: ActivatedRoute,
    private jobService: NMOService,
  ) {

  }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.GetAllService();
    // this.services = this.servicesService.getServices();
    this.user = JSON.parse(localStorage.getItem('userdetails') as string)
    this.role = JSON.parse(localStorage.getItem('roles') as string)

    this.activeRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.GetVOServiceById(+id);
        this.serviceRequestId = +id;
      }
    });
  }

  GetVOServiceById(id: number) {
     this.showDetailsLoader = true; 
    this.jobService.GetVOServiceById(id).subscribe({
      next: (x) => {
        this.showDetailsLoader = false;
        if (x.ok) {
          this.serviceModel = x.body.data;
          console.log(x.body.data,'x.body.data')
          if (x.body.data != undefined && x.body.data != "" && x.body.data != null) {
            if (x.body.data.employee != undefined || x.body.data.employee != "" || x.body.data.employee != null) {
              this.employee = x.body.data.employee
            }
          }
        } else {
          this.showDetailsLoader = false;
          this.toastr.displayErrorMessage('NMO', x.body.message);
        }
      },
      error: (err) => {
        this.showDetailsLoader = false;
        this.toastr.displayErrorMessage('NMO', err.message);
      }
    });
  }
  SubmitUpdatePaymentStatus() {
    const model = {
      'employeeId': this.serviceModel?.employeeId,
      'id': this.serviceModel?.id,
    }

    this.showLoader = true;
    this.jobService.UpdatePaymentStatus(model).subscribe(x => {
      if (x?.body?.success) {
        this.showLoader = false;
        this.toastr.displaySuccessMessage(x?.body?.message, x?.body?.success);
        if (this.serviceRequestId) {
          setTimeout(() => {
            this.GetVOServiceById(this.serviceRequestId);
          }, 3000)

        }
      } else {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }

    }, (error) => {
      this.showLoader = false;
    });
  }

   SubmitUpdateServiceActive() {
    const model = {
      'employeeId': this.serviceModel?.employeeId,
      'id': this.serviceModel?.id,
    }

    this.showLoader = true;
    this.jobService.UpdateServiceActive(model).subscribe(x => {
      if (x?.body?.success) {
        this.showLoader = false;
        this.toastr.displaySuccessMessage(x?.body?.message,'');
        if (this.serviceRequestId) {
          setTimeout(() => {
            this.GetVOServiceById(this.serviceRequestId);
          }, 3000)

        }
      } else {
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }

    }, (error) => {
      this.showLoader = false;
    });
  }

  GetAllService() {

    this.service.GetAllService().subscribe(x => {
      if (x.ok == true) {
        this.serviceList = x.body.data;
        this.serviceList = this.serviceList.filter(x => !x.hasPackages);
      }
      else {
        this.toastr.displayErrorMessage('NMO', x.body.message);

      }

    }, (error) => {
      this.toastr.displayErrorMessage('NMO', error.message);

    });
  }




  openModal(service: Service): void {
    this.router.navigate(['/customer-project', 'serv=' + service.id]);

    // if(service.id == 1){

    // }

    // if(service.id == 2){

    // }

    // if(service.id == 3){

    // }

    // if(service.id == 4){

    // }

    //   this.modalService.open(this.modalServicePopUp, { backdrop: 'static' });
    //   this.serviceModel = service;

    //  this.packageService.GetPackagesByServiceId(service.id).subscribe(x => {
    //     if (x.ok == true) {
    //       this.packageList = x.body.data;
    //     }
    //     else {
    //       this.toastr.displayErrorMessage('NMO', x.body.message);

    //     }

    //   }, (error) => {
    //     this.toastr.displayErrorMessage('NMO', error.message);

    //   });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedService = null;
    document.body.style.overflow = 'auto';
  }


  onClose(): void {
    this.modalService.dismissAll();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  selectPackage(pkg: any): void {
    alert(`You selected the ${pkg.name} package for ${pkg.price}`);
  }

}
