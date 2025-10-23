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
import { MVPService } from '../../../shared/services/twsbservices/mvp.service';
import { MvpProgram } from '../../../models/MVPModel';
 import { ReportService } from '../../../services/report.service';


@Component({
  selector: 'app-mvp-service-status-request',
  standalone: false,
  //imports: [],
  providers : [DisplaymessageComponent],
  templateUrl: './mvp-service-status-request.component.html',
  styleUrl: './mvp-service-status-request.component.scss'
})
export class MVPServiceStatusRequestComponent {
  //serviceReqModel = new ServiceRequest();
  employeeId : any
//projectRequestList!: RequestList[];
mvpProgramList!: MvpProgram[];

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
  public mVPService: MVPService,
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
// serviceReqModel: ServiceRequest = {
//   id: 0,
//   userId: '',
//   serviceId: 0,
//   serviceName: '',
//   packageId: 0,
//   packageName: '',
//   status: '',
//   paymentStatus: '',
//   entrepreneur: {
//     firstNames: '',
//     lastName: '',
//     emailAddress: '',
//     password: '',
//     confirmpassword: '',
//     roleIds: []
//   }
// };
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
this.GetAllMvpRequests(statusId);
  }
  if(this.roleId == 1) {
    this.GetMvpRequestsByEmployeeId(statusId);
  }
  
  }
  generateReport() {
    const statusId = 0; // You can change this or get from filter
    this.reportService.exportMvpProgramList(statusId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Mvp_${new Date().toISOString().replace(/[:.]/g, '_')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

GetAllMvpRequests(statusId: any) {

    this.mVPService.GetAllMvpRequests(statusId).subscribe( {
     next:(x)=>{
       if (x.ok == true) {
        this.mvpProgramList = x.body.data;
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

  GetMvpRequestsByEmployeeId(statusId: any) {

    this.mVPService.GetMvpRequestsByEmployeeId(this.employeeId, statusId).subscribe( {
     next:(x)=>{
       if (x.ok == true) {
        this.mvpProgramList = x.body.data;
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
  

// GetPackagesByServiceId(ServiceId: number) {

//     this.packageService.GetPackagesByServiceId(ServiceId).subscribe( {
//      next:(x)=>{
//        if (x.ok == true) {
//         this.packageList = x.body.data;
//       }
//       else {
//         this.showLoader = false;
//         this.toastr.displayErrorMessage('NMO', x.body.message);
//       }

//     }, 
//     error : (error) => {
//       this.showLoader = false;
//       this.toastr.displayErrorMessage('NMO', error.message);
//     },
//     complete: () => {
//       this.showLoader = false;
//     }
//     });
//   }
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

//   truncateText(text: string, limit: number): string {
//     return text.length > limit ? text.slice(0, limit) + '...' : text;
//   }

//   viewServiceRequests()
//   {    
//       this.searchService.GetAllServiceRequests(this._userInfo.userId).subscribe( {
//         next: (data) =>
//         {
//           //this.recordsFound = data.body.resultCount;
//           console.log(data.body.data);
//           this.serviceReqList = data.body.data;
//           //this.paginate = data.body.paginate;
//         },
//         error: (error) =>
//         {
//           this.actionInProgress = false;
//           this.toaster.displayErrorMessage('NMO',error.error.message);
//         },
//         complete: () => {
//           this.actionInProgress = false;
//         } 
//       });
//      }

// GetAllService() {
//   this.service.GetAllService().subscribe({
//     next: (x) => {
//     if (x.ok == true) {
//       this.serviceList = x.body.data;
//     }
//     else {
//       this.showLoader = false;
//       this.toastr.displayErrorMessage('NMO', x.body.message);
//     }

//   }, error: (error) => {
//     this.showLoader = false;
//     this.toastr.displayErrorMessage('NMO', error.message);
//   },
//   complete: () => {
//         this.showLoader = false;
//       }
//   });
// }

// AddRequestPopup(){
//   this.GetAllService();
//   this.serviceReqModel = new ServiceRequest();
//   this.serviceReqModel.id = 0;
//   this.modalService.open(this.modalServicePopUp, { backdrop: 'static' });
// }

// onPackageChange(ServiceId: number) {
// this.GetPackagesByServiceId(ServiceId);
// }

// Submit(){
// this.serviceReqModel.userId =this._userInfo.userId ; // Assuming userId is 1 for now, replace with actual user ID logic
// if(this.role!=='Super Administrator'){
//   this.searchService.CreateServiceRequest(this.serviceReqModel).subscribe({
//   next:(response)=>{
//     this.toaster.displaySuccessMessage('NMO','Service Request Created Successfully');
//     this.modalService.dismissAll();
//   },
//   error :(error)=>{
//     this.toaster.displayErrorMessage('NMO',error.error.message);
//   },
//  complete : ()=>{
//     this.viewServiceRequests();
//   }
// });
// }
// else{
//   this.serviceReqModel.entrepreneur.roleIds[0]=8;
//   this.searchService.CreateServiceRequestByAdmin(this.serviceReqModel).subscribe({
//     next:(response)=>{
//       this.toaster.displaySuccessMessage('NMO','Service Request Created Successfully');
//       this.modalService.dismissAll();
//     },
//     error :(error)=>{
//       this.toaster.displayErrorMessage('NMO',error.error.message);
//     },
//     complete : ()=>{
//       this.viewServiceRequests();
//     }
//   });
// }
// }
// UpdateService(){

// }

}

  // previousPage()
  // {
  //   if(this.pageId > 1)
  //   {
  //     this.pageId --;
  //     this.viewJobList(this.jobListType,'internal');
  //   }
    
  // }

  // nextPage()
  // {
  //   this.pageId ++;
  //   this.viewJobList(this.jobListType,'internal');
  // }

