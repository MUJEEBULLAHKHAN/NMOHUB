import { Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authentication } from '../../../shared/models/authentication';
import { UserAuthService } from '../../../shared/services/twsbservices/user-auth.service';
import { CommonModule } from '@angular/common';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { Service, Package } from '../../../models/Reference';
import { PackageService } from '../../../shared/services/twsbservices/package.service';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, NgbModule, CommonModule],
  providers: [DisplaymessageComponent],
  templateUrl: './service-customer.component.html',
  styleUrl: './service-customer.component.scss'
})
export class ServiceComponent implements OnInit, OnDestroy {
  authentication = new authentication();
  disabled = '';
  active: any;
  showLoader: boolean | undefined;
  public loginForm!: FormGroup;
  public error: any = '';
  showPassword = false;
  toggleClass = "ri-eye-off-line";
  serviceList!: Service[];
  packageList!: Package[];
  selectedService: Service | null = null;
  isModalOpen = false;
  serviceModel!: Service;

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
  ) {

  }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }


  ngOnInit(): void {
    this.GetAllService();
    // this.services = this.servicesService.getServices();
  }

  GetAllService() {
    this.showLoader = true;
    this.service.GetAllService().subscribe(x => {
      if (x.ok == true) {
        this.showLoader = false;
        this.serviceList = x.body.data;
        this.serviceList = this.serviceList.filter(x => !x.hasPackages);
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
