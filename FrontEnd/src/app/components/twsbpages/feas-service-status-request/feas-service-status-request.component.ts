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
import { FeasService } from '../../../shared/services/twsbservices/feas.service';
//import { MvpProgram } from '../../../models/MVPModel';
 import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-feas-service-status-request',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './feas-service-status-request.component.html',
  styleUrl: './feas-service-status-request.component.scss'
})
export class FeasServiceStatusRequestComponent {
  //serviceReqModel = new ServiceRequest();
  employeeId: any
  //projectRequestList!: RequestList[];
  mvpProgramList!: any[];

  role: string;
  roleId: number;
  showLoader = false;
  _userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
  snapshotCounts = new JobCountSnapshot();
  @ViewChild('modalServicePopUp') modalServicePopUp: TemplateRef<any> | undefined;
  constructor(private modalService: NgbModal, private toastr: DisplaymessageComponent,
    public authservice: NMOService,
    private route: ActivatedRoute,
    private feasService: FeasService,
    private reportService: ReportService
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
    var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    console.log("USER INFO IS ", this._userInfo);
    this.role = roles[0].name;
    this.roleId = roles[0].id;
    this.employeeId = this._userInfo.employeeId;
  }

  ngOnInit() {

    const idParam = this.route.snapshot.paramMap.get('id');
    let statusId = Number(idParam);
    if (statusId == undefined || statusId == null) {
      statusId = 0
    }


    if (this.roleId == 10) {
      this.GetAllFeasibilityRequests(statusId);
    }
    if (this.roleId == 1) {
      this.GetFeasibilityRequestsByEmployeeId(statusId);
    }

  }
generateReport() {
    const statusId = 0; // You can change this or get from filter
    this.reportService.exportFeasibilityProgramList(statusId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fease_${new Date().toISOString().replace(/[:.]/g, '_')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
  GetAllFeasibilityRequests(statusId: any) {

    this.feasService.GetAllFeasibilityRequests(statusId).subscribe({
      next: (x) => {
        if (x.ok == true) {
          this.mvpProgramList = x.body.data;
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

  GetFeasibilityRequestsByEmployeeId(statusId: any) {

    this.feasService.GetFeasibilityRequestsByEmployeeId(this.employeeId, statusId).subscribe({
      next: (x) => {
        if (x.ok == true) {
          this.mvpProgramList = x.body.data;
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
