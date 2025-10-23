import { Component } from '@angular/core';
import { AttendanceChartData, AttendanceChartData1, ReadyForCollectionData } from '../../../../shared/data/dashboard_chartData/schoolcharts.data';
import { DashboardService } from '../../../../shared/services/twsbservices/dashboard.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { AppStateService } from '../../../../shared/services/app-state.service';
import { NMOService } from '../../../../shared/services/new.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-main-dashboard',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss'
})


export class MainDashboardComponent {
  _userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
  role!: string;
  roleId!: number;
  status!: any;


  constructor(private jobService: NMOService, 
    private toaster: DisplaymessageComponent, 
    private appStateService: AppStateService,
    private route:ActivatedRoute,
  ) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit() {
    var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    this.role = roles[0].name;
    this.roleId = roles[0].id;

    const idParam=this.route.snapshot.paramMap.get('id');
    let statusId = Number(idParam);
    if (statusId== undefined || statusId == null) {
      statusId = 0
    }
    

    if (this.roleId != 10) {
      this.GetAllServicesRequestDashboardCounterByEmployeeGroupByStatusId();
    }
    else {
      this.GetAllServicesRequestDashboardCounterGroupByStatusId();
    }

  }

  GetAllServicesRequestDashboardCounterByEmployeeGroupByStatusId() {
    this.jobService.GetAllServicesRequestDashboardCounterByEmployeeGroupByStatusId(this._userInfo.employeeId).subscribe({
      next: (user) => {
        if (user.body.success) {
          this.status = user.body.data;
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', 'Failed to load dashboard analytics');
      },
      complete: () => {
      }
    });
  }

  GetAllServicesRequestDashboardCounterGroupByStatusId() {
    this.jobService.GetAllServicesRequestDashboardCounterGroupByStatusId().subscribe({
      next: (user) => {
        if (user.body.success) {
          this.status = user.body.data;
        }
        else {
          this.toaster.displayErrorMessage('NMO', user.body.message);
        }
      },
      error: (error) => {
        this.toaster.displayErrorMessage('NMO', 'Failed to load dashboard analytics');
      },
      complete: () => {
      }
    });
  }

}


