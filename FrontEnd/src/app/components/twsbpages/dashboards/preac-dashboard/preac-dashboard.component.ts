import { Component } from '@angular/core';
import { AttendanceChartData, AttendanceChartData1, ReadyForCollectionData } from '../../../../shared/data/dashboard_chartData/schoolcharts.data';
import { DashboardService } from '../../../../shared/services/twsbservices/dashboard.service';
import { DisplaymessageComponent } from '../../../../shared/components/displaymessage/displaymessage.component';
import { AppStateService } from '../../../../shared/services/app-state.service';
import { NMOService } from '../../../../shared/services/new.service';
import { PreacService } from '../../../../shared/services/twsbservices/preac.service';

@Component({
  selector: 'app-preac-dashboard',
  standalone: false,
  //imports: [],
  providers: [DisplaymessageComponent],
  templateUrl: './preac-dashboard.component.html',
  styleUrl: './preac-dashboard.component.scss'
})


export class PreacDashboardComponent {
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


  constructor(private jobService: NMOService, 
    private preacService: PreacService,
    private toaster: DisplaymessageComponent, private appStateService: AppStateService) {
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
    this.preacService.DashboardCountersByUser(this._userInfo.employeeId).subscribe({
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
    this.preacService.GetAllDashboardCounter().subscribe({
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


