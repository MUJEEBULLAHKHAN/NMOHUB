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
import { ForeignEntrepreneurService } from '../../../shared/services/twsbservices/ForeignEntrepreneur.service';
import { ForeignEntrepreneur } from '../../../models/foreignentrepreneur.model';
import { ReportService } from '../../../services/report.service';


@Component({
  selector: 'app-foreign-entrepreneur-service-status-request',
  standalone: false,
  //imports: [],
  providers : [DisplaymessageComponent],
  templateUrl: './foreign-entrepreneur-service-status-request.component.html',
  styleUrl: './foreign-entrepreneur-service-status-request.component.scss'
})
export class ForeignEntrepreneurServiceStatusRequestComponent {
  //serviceReqModel = new ServiceRequest();
  employeeId : any
//projectRequestList!: RequestList[];
foreignEntrepreneurList!: ForeignEntrepreneur[];

  packageList!: Package[];
    serviceList!: Service[];
  serviceReqList:any[]=[];
  actionInProgress:boolean=false;
  recordsFound:any;
  pageId:number = 1;
  paginate:boolean=false;
  jobListType:any;
role:any ;
roleId:any;
showLoader = false;
showPassword = false;
toggleClass = "ri-eye-off-line";
_userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
  snapshotCounts = new JobCountSnapshot();
@ViewChild('modalServicePopUp') modalServicePopUp: TemplateRef<any> | undefined;

  constructor(
    private searchService: SearchService,
    private toaster: DisplaymessageComponent,
    private packageService: PackageService,
    private service: ServiceApi,
    private modalService: NgbModal,
    private toastr: DisplaymessageComponent,
    public authservice: NMOService,
    public foreignentrepreneurService: ForeignEntrepreneurService,
    private route: ActivatedRoute,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    const roles = JSON.parse(localStorage.getItem('roles') ?? '');
    console.log("USER INFO IS ", this._userInfo);
    this.role = roles[0].name;
    this.roleId = roles[0].id;
    this.employeeId = this._userInfo.employeeId;

    const idParam = this.route.snapshot.paramMap.get('id');
    let statusId = Number(idParam);
    if (statusId === undefined || statusId === null || isNaN(statusId)) {
      statusId = 0;
    }
    if (this.roleId === "10") {
      this.GetAllForeignEntrepreneurRequests(statusId);
    } else {
      this.GetForeignEntrepreneurRequestsByEmployeeId(statusId);
    }
  }

  generateReport() {
    const statusId = 0; // You can change this or get from filter
    this.reportService.exportForeignEntrepreneurList(statusId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `FE_${new Date().toISOString().replace(/[:.]/g, '_')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'ri-eye-line') {
      this.toggleClass = 'ri-eye-off-line';
    } else {
      this.toggleClass = 'ri-eye-line';
    }
  }

GetAllForeignEntrepreneurRequests(statusId: any) {
    this.foreignentrepreneurService.GetAllProjectRequests(statusId).subscribe( {
     next:(x)=>{
       if (x.ok == true) {
        this.foreignEntrepreneurList = x.body.data;
      }
      else {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }
    }, 
    error : (error) => {
      this.showLoader = false;
      this.toastr.displayErrorMessage('NMO', error.message);
    },
    complete: () => {
      this.showLoader = false;
    }
    });
  }

  GetForeignEntrepreneurRequestsByEmployeeId(statusId: any) {

    this.foreignentrepreneurService.GetFERequestsByEmployeeId(this.employeeId, statusId).subscribe( {
     next:(x)=>{
       if (x.ok == true) {
        this.foreignEntrepreneurList = x.body.data;
      }
      else {
        this.showLoader = false;
        this.toastr.displayErrorMessage('NMO', x.body.message);
      }
    }, 
    error : (error) => {
      this.showLoader = false;
      this.toastr.displayErrorMessage('NMO', error.message);
    },
    complete: () => {
      this.showLoader = false;
    }
    });
  }
  
  submitSearch(value:any)
  {
  //   this.actionInProgress = true;
  //   let searchResult = new JobSearch();
  //   searchResult.searchValue = value;
    
  //   this.searchService.SearchJob(searchResult).subscribe({
  //     next: (data) => 
  //     {
  //        // this.searchResults = data.body.results;
  //         this.recordsFound = data.body.resultCount;
  //         if(data.body.success == false)
  //         {
  //           this.toaster.displayErrorMessage('NMO',data.body.message);
  //         }
  //     },     
  //     error: (error) =>
  //     {
  //       this.actionInProgress = false;
  //       this.toaster.displayErrorMessage('NMO',error.error.message);
  //     },
  //     complete: () => {
  //       this.actionInProgress = false;
  //     } 
  // });
  }
}