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
import { PreacService } from '../../../shared/services/twsbservices/preac.service';
import { PreAccelerator } from '../../../models/preac.models';
  import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-preac-service-status-request',
  standalone: false,
  //imports: [],
  providers : [DisplaymessageComponent],
  templateUrl: './preac-service-status-request.component.html',
  styleUrl: './preac-service-status-request.component.scss'
})
export class PREACServiceStatusRequestComponent {
  //serviceReqModel = new ServiceRequest();
  employeeId : any
//projectRequestList!: RequestList[];
preAcceleratorList!: PreAccelerator[];

  packageList!: Package[];
    serviceList!: Service[];
  serviceReqList:any[]=[];
  actionInProgress:boolean=false;
  recordsFound:any;
  pageId:number = 1;
  paginate:boolean=false;
  jobListType:any;
role:string ;
roleId:number;
showLoader = false;
showPassword = false;
toggleClass = "ri-eye-off-line";
_userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
  snapshotCounts = new JobCountSnapshot();
@ViewChild('modalServicePopUp') modalServicePopUp: TemplateRef<any> | undefined;
  constructor(private searchService:SearchService,private toaster:DisplaymessageComponent,
    private packageService: PackageService,private service: ServiceApi, private modalService: NgbModal,private toastr: DisplaymessageComponent,
  public authservice: NMOService,
  public preacService: PreacService,
  private route:ActivatedRoute,
  private reportService: ReportService
)
  {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    console.log("USER INFO IS ", this._userInfo);
    this.role = roles[0].name;
    this.roleId = roles[0].id;
    this.employeeId = this._userInfo.employeeId;
  }
  
public togglePassword() {
  this.showPassword = !this.showPassword;
  if (this.toggleClass === 'ri-eye-line') {
    this.toggleClass = 'ri-eye-off-line';
  } else {
    this.toggleClass = 'ri-eye-line';
  }
}
  ngOnInit()
  {
  
    const idParam=this.route.snapshot.paramMap.get('id');
    let statusId = Number(idParam);
    if (statusId== undefined || statusId == null) {
      statusId = 0
    }
    

  if(this.roleId == 10) {
this.GetAllPreAcceleratorRequests(statusId);
  }
  if(this.roleId == 1) {
    this.GetPreAcceleratorRequestsByEmployeeId(statusId);
  }
  
  }

generateReport() {
    const statusId = 0; // You can change this or get from filter
    this.reportService.exportPreAccelaratorProgramList(statusId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Preac_${new Date().toISOString().replace(/[:.]/g, '_')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
GetAllPreAcceleratorRequests(statusId: any) {
    this.preacService.GetAllPreAcceleratorRequests(statusId).subscribe( {
     next:(x)=>{
       if (x.ok == true) {
        this.preAcceleratorList = x.body.data;
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

  GetPreAcceleratorRequestsByEmployeeId(statusId: any) {

    this.preacService.GetPreAcceleratorRequestsByEmployeeId(this.employeeId, statusId).subscribe( {
     next:(x)=>{
       if (x.ok == true) {
        this.preAcceleratorList = x.body.data;
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