import { Component } from '@angular/core';
import { AttendanceChartData, AttendanceChartData1, ReadyForCollectionData } from '../../../../shared/data/dashboard_chartData/schoolcharts.data';
import { DashboardService } from '../../../../shared/services/twsbservices/dashboard.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { AppStateService } from '../../../../shared/services/app-state.service';
import { NMOService } from '../../../../shared/services/new.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.scss'
})


export class DashboardOverviewComponent {
  _userInfo = JSON.parse(localStorage.getItem('userdetails') ?? '');
  role!: string;
  roleId!: number;
  status!: any;
  // public chartOptions  = AttendanceChartData;
  // public chartOptions1  = AttendanceChartData1;
  // public chartOptions2  :any;
  // readyForCollectionChartData:any;
  // readyForCollectionChartStatSeries:number[]=[];
  // vehiclesCollectedChartStatSeries:number[]=[];
  // allStats:any;


  constructor(private jobService: NMOService, private toaster: DisplaymessageComponent, private appStateService: AppStateService) {
    document.querySelector('.single-page-header')?.classList.add('d-none');
  }

  ngOnInit() {
    var roles = JSON.parse(localStorage.getItem('roles') ?? '');
    this.role = roles[0].name;
    this.roleId = roles[0].id;

    if (this.roleId != 10) {
      this.DashboardCountersByUser();
    }
    else {
      this.GetAllDashboardCounter();
    }

  }

  DashboardCountersByUser() {
    this.jobService.DashboardCountersByUser(this._userInfo.employeeId).subscribe({
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

  GetAllDashboardCounter() {
    this.jobService.GetAllDashboardCounter().subscribe({
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


