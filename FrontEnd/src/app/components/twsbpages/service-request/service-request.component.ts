import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SearchService } from '../../../shared/services/twsbservices/search.service';
import { DisplaymessageComponent } from '../../../shared/components/displaymessage/displaymessage.component';
import { JobSearch } from '../../../shared/models/jobsearch';
import { JobCountSnapshot } from '../../../models/DeserializedModels/JobCountSnapshot';
import { Package, Service, ServiceRequest } from '../../../models/Reference';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PackageService } from '../../../shared/services/twsbservices/package.service';
import { ServiceApi } from '../../../shared/services/twsbservices/service.service';
import { NMOService } from '../../../shared/services/new.service';
import { RequestList } from '../../../models/new-service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-service-request',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.scss'
})
export class ServiceRequestComponent {
  //serviceReqModel = new ServiceRequest();
  employeeId: any
  projectRequestList!: RequestList[];

  packageList!: Package[];
  serviceList!: Service[];
  serviceReqList: any[] = [];
  actionInProgress: boolean = false;
  recordsFound: any;
  pageId: number = 1;
  paginate: boolean = false;
  jobListType: any;
  role: string;
  roleId: number;
  showLoader = false;
  showPassword = false;
  toggleClass = "ri-eye-off-line";
  _userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
  snapshotCounts = new JobCountSnapshot();
  @ViewChild('modalServicePopUp') modalServicePopUp: TemplateRef<any> | undefined;
  constructor(private searchService: SearchService, private toaster: DisplaymessageComponent,
    private packageService: PackageService, private service: ServiceApi, private modalService: NgbModal, private toastr: DisplaymessageComponent,
    public authservice: NMOService,
    private route: ActivatedRoute,
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    console.log("USER INFO IS ", this._userInfo);
    this.role = roles[0].name;
    this.roleId = roles[0].id;
    this.employeeId = this._userInfo.employeeId;
  }
  serviceReqModel: ServiceRequest = {
    id: 0,
    userId: '',
    serviceId: 0,
    serviceName: '',
    packageId: 0,
    packageName: '',
    status: '',
    paymentStatus: '',
    entrepreneur: {
      firstNames: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmpassword: '',
      roleIds: []
    }
  };
  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }
  ngOnInit() {

    const idParam=this.route.snapshot.params['id'];
    let statusId = Number(idParam);
    if (statusId== undefined || statusId == null) {
      statusId = 0
    }


    if (this.roleId == 10) {
      this.GetAllServicesList(statusId);
    }
    if (this.roleId == 1) {
      this.GetAllServiceListByEmployeeId(statusId);
    }

  }

  GetAllServicesList(statusId: any) {

    this.authservice.GetAllServicesList(statusId).subscribe({
      next: (x) => {
        if (x.ok == true) {
          this.projectRequestList = x.body.data;
        }
        else {
          this.showLoader = false;
          this.toastr.displayErrorMessage('NMO', x.body.message);
        }

      },
      error: (error) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', error.message);
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  GetAllServiceListByEmployeeId(statusId: any) {

    this.authservice.GetAllServiceListByEmployeeId(this.employeeId, statusId).subscribe({
      next: (x) => {
        if (x.ok == true) {
          this.projectRequestList = x.body.data;
        }
        else {
          this.showLoader = false;
          this.toastr.displayErrorMessage('NMO', x.body.message);
        }

      },
      error: (error) => {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', error.message);
      },
      complete: () => {
        this.showLoader = false;
      }
    });
  }

  submitSearch(value: any) {

  }

}
